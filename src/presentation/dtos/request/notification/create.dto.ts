import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @ApiProperty()
  readonly userId: string;

  @IsString()
  @ApiProperty()
  readonly receiverId: string;

  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @ApiProperty()
  readonly body: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly imageUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly videoId?: string;

  @IsEnum(NotificationType)
  @ApiProperty({ enum: NotificationType })
  readonly type: NotificationType;
}
