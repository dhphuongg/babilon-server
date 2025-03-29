import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @ApiProperty()
  readonly userId: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  readonly receivers: string[];

  @IsString()
  @ApiProperty()
  readonly videoId: string;

  @IsString()
  @ApiProperty()
  readonly title: string;
}
