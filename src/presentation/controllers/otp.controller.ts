import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequestOtpDto, VerifyOtpDto } from '../dtos/otp';
import {
  RequestOtpCommand,
  VerifyOtpCommand,
} from 'src/application/commands/otp/implements';

@Controller('otp')
export class OtpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.commandBus.execute(
      new RequestOtpCommand(requestOtpDto.email, requestOtpDto.type),
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.commandBus.execute(new VerifyOtpCommand(verifyOtpDto));
  }
}
