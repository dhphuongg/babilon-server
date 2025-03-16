import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Role } from '@prisma/client';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

import { EnvironmentConfig } from '../../config/environment.config';
import { JwtPayload } from '../../../domain/interfaces/jwt-payload.interface';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentConfig, true>,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new WsException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.secret', { infer: true }),
      });

      if (payload.role !== Role.ADMIN) {
        // get token from cache
        const accessToken = await this.cacheManager.get(
          `ACCESS_TOKEN:${payload.userId}`,
        );
        // compare token to check session
        if (accessToken !== token) {
          throw new WsException('Invalid token');
        }
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        console.log('User not found');
        throw new WsException('Invalid token');
      }

      return true;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new WsException((error.message as string) || 'Invalid token');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
