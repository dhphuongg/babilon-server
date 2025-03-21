import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { AppConstant } from 'src/domain/constants';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly fullName: string;

  @IsString()
  @MinLength(AppConstant.Otp.OTP_CODE_LENGTH)
  @MaxLength(AppConstant.Otp.OTP_CODE_LENGTH)
  @ApiProperty()
  readonly otpCode: string;
}
