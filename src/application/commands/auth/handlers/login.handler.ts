import { BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as ms from 'ms';

import { LoginCommand } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { EnvironmentConfig } from 'src/infrastructure/config/environment.config';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentConfig, true>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: LoginCommand): Promise<any> {
    const {
      loginRequestDto: { emailOrUsername, password },
    } = command;

    const user = await this.getAuthenticatedUser(emailOrUsername, password);

    // sign jwt token
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.refreshTokenExpirationTime', {
        infer: true,
      }),
    });

    // save token to cache
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const ttl = ms(
      this.configService.get('jwt.accessTokenExpirationTime', {
        infer: true,
      }),
    );
    await this.cacheManager.set(`ACCESS_TOKEN:${user.id}`, accessToken, ttl);

    return { accessToken, refreshToken, role: user.role };
  }

  private async getAuthenticatedUser(
    emailOrUsername: string,
    password: string,
  ) {
    const user =
      await this.userRepository.getByEmailOrUsername(emailOrUsername);
    if (!user) {
      throw new BadRequestException(
        'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      );
    }

    // verify password
    await this.verifyPassword(password, user.password);

    return { ...user, password: undefined };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException(
        'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      );
    }
  }
}
