import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly fullName: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar?: Express.Multer.File;
}
