import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '../auth';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends RegisterDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly signature?: string;
}
