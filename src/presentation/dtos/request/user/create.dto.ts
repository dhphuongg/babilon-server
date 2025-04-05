import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '../auth';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends RegisterDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly normalizedName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  avatar?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly signature?: string;
}
