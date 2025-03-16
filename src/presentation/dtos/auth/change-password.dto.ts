import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  readonly currentPassword: string;

  @IsString()
  @ApiProperty()
  readonly newPassword: string;
}
