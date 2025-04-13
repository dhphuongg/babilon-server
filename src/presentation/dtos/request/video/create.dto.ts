import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  readonly isPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  readonly commentable?: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  video: Express.Multer.File;
}

export class VideoUploadDto {
  video: Express.Multer.File;
  isPrivate?: boolean;
  userId: string;
}

export class VideoUploadResponse {
  fileId: string;
  duration: number;
  url: string;
  hlsUrl: string;
  thumbnail: string;
  height: number;
  width: number;
  size: number;
}
