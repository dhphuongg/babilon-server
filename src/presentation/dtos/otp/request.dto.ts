import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ enum: OtpType })
  @IsEnum(OtpType)
  readonly type: OtpType;
}
