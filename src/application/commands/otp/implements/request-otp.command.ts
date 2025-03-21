import { ICommand } from '@nestjs/cqrs';
import { OtpType } from '@prisma/client';

export class RequestOtpCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly type: OtpType,
  ) {}
}
