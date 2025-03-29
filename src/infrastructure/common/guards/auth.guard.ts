import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Role } from '@prisma/client';

import { EnvironmentConfig } from '../../config/environment.config';
import { JwtPayload } from '../../../domain/interfaces/jwt-payload.interface';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfig, true>,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Yêu cầu cung cấp token xác thực');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.secret', { infer: true }),
      });

      if (payload.role !== Role.ADMIN) {
        // get token from cache
        const userIdFromCache = await this.cacheManager.get(
          `ACCESS_TOKEN:${token}`,
        );
        // compare token to check session
        if (userIdFromCache !== payload.userId) {
          throw new UnauthorizedException('Token xác thực không hợp lệ');
        }
      }

      // Add payload to request object for use in controllers
      request.user = payload;

      // Check if user not exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) {
        console.log('Không tìm thấy người dùng');
        throw new UnauthorizedException('Token xác thực không hợp lệ');
      }

      return true;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Extract token from Authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
