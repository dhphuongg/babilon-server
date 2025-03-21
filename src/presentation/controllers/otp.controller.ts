import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequestOtpDto } from '../dtos/otp';
import { RequestOtpCommand } from 'src/application/commands/otp/implements';

@Controller('otp')
export class OtpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('request')
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.commandBus.execute(
      new RequestOtpCommand(requestOtpDto.email, requestOtpDto.type),
    );
  }
}
