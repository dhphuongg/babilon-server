import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  readonly newPassword: string;

  @ApiProperty()
  @IsString()
  readonly token: string;
}
