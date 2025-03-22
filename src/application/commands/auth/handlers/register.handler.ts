import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterCommand } from '../implements';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { AppConstant } from 'src/domain/constants';
import { VerifyOtpCommand } from '../../otp/implements';
import { OtpType } from '@prisma/client';
import { IOtpRepository } from 'src/domain/repositories/otp.repository.interface';
import { OTP_REPOSITORY_TOKEN } from 'src/infrastructure/providers/otp.repository.provider';
import { StringUtil } from 'src/infrastructure/common/utils';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly commandBus: CommandBus,
    @Inject(OTP_REPOSITORY_TOKEN)
    private readonly otpRepository: IOtpRepository,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    const { registerDto } = command;

    const userFoundByEmail = await this.userRepository.getByEmail(
      registerDto.email,
    );
    if (userFoundByEmail) {
      throw new BadRequestException('Địa chỉ email đã tồn tại');
    }

    const userFoundByUsername = await this.userRepository.getByUsername(
      registerDto.username,
    );
    if (userFoundByUsername) {
      throw new BadRequestException('Tên người dùng đã tồn tại');
    }

    // Verify OTP
    await this.commandBus.execute(
      new VerifyOtpCommand({
        email: registerDto.email,
        otpCode: registerDto.otpCode,
        type: OtpType.REGISTER,
      }),
    );

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      AppConstant.Auth.PASSWORD_SALT,
    );

    await this.userRepository.createUser({
      ...registerDto,
      password: hashedPassword,
      normalizedName: StringUtil.normalize(registerDto.fullName),
    });

    return { message: 'Đăng ký thành công' };
  }
}
