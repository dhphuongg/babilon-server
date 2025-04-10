import { ICommand } from '@nestjs/cqrs';

import { VerifyOtpDto } from 'src/presentation/dtos/request/otp/verify.dto';

export class VerifyOtpCommand implements ICommand {
  constructor(public readonly verifyOtpDto: VerifyOtpDto) {}
}
