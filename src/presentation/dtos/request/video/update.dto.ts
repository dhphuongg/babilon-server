import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVideoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly title?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isPrivate?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly commentable?: boolean;
}
