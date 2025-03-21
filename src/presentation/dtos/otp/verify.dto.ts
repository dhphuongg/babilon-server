import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '@prisma/client';
import { IsEnum, IsString, Length } from 'class-validator';

import { AppConstant } from 'src/domain/constants';

export class VerifyOtpDto {
  @IsString()
  @ApiProperty()
  readonly email: string;

  @IsEnum(OtpType)
  @ApiProperty({ enum: OtpType })
  readonly type: OtpType;

  @IsString()
  @Length(AppConstant.Otp.OTP_CODE_LENGTH)
  @ApiProperty()
  readonly otpCode: string;
}
