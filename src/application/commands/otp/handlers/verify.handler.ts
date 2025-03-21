import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { VerifyOtpCommand } from '../implements';
import { OTP_REPOSITORY_TOKEN } from 'src/infrastructure/providers/otp.repository.provider';
import { IOtpRepository } from 'src/domain/repositories/otp.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppConstant } from 'src/domain/constants';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    @Inject(OTP_REPOSITORY_TOKEN)
    private readonly otpRepository: IOtpRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<any> {
    const {
      verifyOtpDto: { email, otpCode, type },
    } = command;

    const otp = await this.otpRepository.getByEmailAndType({ email, type });

    if (!otp || otp.code !== otpCode) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    const authToken = this.jwtService.sign(
      { email, type },
      { expiresIn: `${AppConstant.Otp.OTP_EXP_MINUTES}m` },
    );

    return { authToken };
  }
}
