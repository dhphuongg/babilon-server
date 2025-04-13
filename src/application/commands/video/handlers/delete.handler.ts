import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { DeleteVideoCommand } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CLOUD_STORAGE_PROVIDER,
  ICloudStorageService,
} from 'src/infrastructure/cloud-storage/interface';

@CommandHandler(DeleteVideoCommand)
export class DeleteVideoHandler implements ICommandHandler<DeleteVideoCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLOUD_STORAGE_PROVIDER)
    private readonly cloudStorageService: ICloudStorageService,
  ) {}

  async execute(command: DeleteVideoCommand): Promise<any> {
    const { userId, videoId } = command;
    // Check if the video exists
    const video = await this.prisma.video.findUnique({
      where: { id: videoId, userId },
    });
    if (!video) {
      throw new NotFoundException('Video không tồn tại');
    }

    // Delete the video from the cloud storage
    await this.cloudStorageService.deleteVideo(video.cloudFileId);

    // Delete the video from the database
    await this.prisma.video.delete({ where: { id: video.id } });

    return 'Xóa video thành công';
  }
}
