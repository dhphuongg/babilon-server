import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { OtpType } from '@prisma/client';

import { RequestOtpCommand } from '../implements/request-otp.command';
import { SendMailEvent } from 'src/application/events/send-mail/send-mail.event';
import { StringUtil } from 'src/infrastructure/common/utils';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { IOtpRepository } from 'src/domain/repositories/otp.repository.interface';
import { OTP_REPOSITORY_TOKEN } from 'src/infrastructure/providers/otp.repository.provider';
import { AppConstant } from 'src/domain/constants';

@CommandHandler(RequestOtpCommand)
export class RequestOtpHandler implements ICommandHandler<RequestOtpCommand> {
  constructor(
    @Inject(OTP_REPOSITORY_TOKEN)
    private readonly otpRepository: IOtpRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RequestOtpCommand): Promise<any> {
    const { email, type } = command;

    // Generate 6-digit OTP code
    const code = StringUtil.generateOtpCode(AppConstant.Otp.OTP_CODE_LENGTH);
    // Set expiration time to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // Save OTP to database
    await this.otpRepository.create({ code, email, type, expiresAt });

    // Case: Register
    if (type === OtpType.REGISTER) {
      await this.requestOtpForRegister(email, code);
    }
    // Case: Password reset
    else if (type === OtpType.PASSWORD_RESET) {
      await this.requestOtpForPasswordReset(email, code);
    }

    return { message: 'Mã OTP đã được gửi đến email của bạn' };
  }

  private async requestOtpForRegister(
    email: string,
    code: string,
  ): Promise<any> {
    // find user by email
    const user = await this.userRepository.getByEmail(email);
    if (user) {
      throw new BadRequestException('Địa chỉ email đã được sử dụng');
    }

    // Emit email event
    this.eventBus.publish(
      new SendMailEvent({
        to: email,
        subject: 'Babilon - Xác thực tài khoản',
        template: AppConstant.Mail.MAIL_TEMPLATE_SOURCES.REGISTER_VERIFICATION,
        context: { code, expiresIn: 5 },
      }),
    );
  }

  private async requestOtpForPasswordReset(
    email: string,
    code: string,
  ): Promise<any> {
    // find user by email
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không chính xác.');
    }

    // Emit email event
    this.eventBus.publish(
      new SendMailEvent({
        to: email,
        subject: 'Babilon - Đặt lại mật khẩu',
        template: AppConstant.Mail.MAIL_TEMPLATE_SOURCES.PASSWORD_RESET,
        context: { code, expiresIn: 5, name: user.fullName },
      }),
    );
  }
}
