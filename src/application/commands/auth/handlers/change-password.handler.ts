import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { ChangePasswordCommand } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { AuthConstants } from 'src/domain/constants/auth.constants';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ChangePasswordCommand) {
    const {
      userId,
      changePasswordDto: { currentPassword, newPassword },
    } = command;

    const user = await this.userRepository.getById(userId);

    await this.verifyPassword(currentPassword, user!.password);

    // hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      AuthConstants.PASSWORD_SALT,
    );

    // update password
    await this.userRepository.updatePassword(user!.id, hashedPassword);

    return { message: 'Đổi mật khẩu thành công' };
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException(
        'Mật khẩu không chính xác. Vui lòng thử lại.',
      );
    }
  }
}
