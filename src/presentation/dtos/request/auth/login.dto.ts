import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @ApiProperty()
  readonly emailOrUsername: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly deviceToken: string;
}
