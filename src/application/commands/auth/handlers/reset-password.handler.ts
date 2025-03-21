import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { ResetPasswordCommand } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { AppConstant } from 'src/domain/constants';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<any> {
    const {
      resetPasswordDto: { newPassword, token },
    } = command;

    let email: string;
    try {
      const { email: emailFromToken, type } = this.jwtService.verify<{
        email: string;
        type: OtpType;
      }>(token);

      // get token from cache
      const cachedToken = await this.cacheManager.get<string>(
        `RESET_PASSWORD_TOKEN:${emailFromToken}`,
      );

      if (
        !cachedToken ||
        cachedToken != token ||
        type !== OtpType.PASSWORD_RESET
      ) {
        throw new BadRequestException('Token không hợp lệ');
      }

      email = emailFromToken;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Token không hợp lệ');
    }

    // get user by email
    const user = await this.userRepository.getByEmail(email);
    // check if user exists
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      AppConstant.Auth.PASSWORD_SALT,
    );
    // update password
    await this.userRepository.updatePassword(user.id, hashedPassword);
    // delete token from cache
    await this.cacheManager.del(`RESET_PASSWORD_TOKEN:${email}`);

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
