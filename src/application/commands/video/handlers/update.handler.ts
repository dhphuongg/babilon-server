import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVideoCommand } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { StringUtil } from 'src/infrastructure/common/utils';
import { ImageKitService } from 'src/infrastructure/image-kit/image-kit.service';
import { VideoUploadResponse } from 'src/presentation/dtos/request/video';

@CommandHandler(UpdateVideoCommand)
export class UpdateVideoHandler implements ICommandHandler<UpdateVideoCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageKitService: ImageKitService,
  ) {}

  async execute(command: UpdateVideoCommand): Promise<any> {
    const { updateVideoDto, userId, videoId } = command;
    const video = await this.prisma.video.findUnique({
      where: { id: videoId, userId },
    });
    if (!video) {
      throw new NotFoundException('Video không tồn tại');
    }

    let normalizedTitle = video.normalizedTitle;
    if (updateVideoDto.title) {
      normalizedTitle = StringUtil.normalize(updateVideoDto.title);
    }

    let newCloudVideo: VideoUploadResponse = {
      fileId: video.cloudFileId,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.duration,
      height: video.height,
      width: video.width,
      size: video.size,
      filePath: video.cloudFilePath,
    };
    if (updateVideoDto.isPrivate && !video.isPrivate) {
      newCloudVideo = await this.imageKitService.changeVideoPrivateStatus({
        fileId: video.cloudFileId,
        userId,
        isPrivateFile: true,
      });
    } else if (!updateVideoDto.isPrivate && video.isPrivate) {
      newCloudVideo = await this.imageKitService.changeVideoPrivateStatus({
        fileId: video.cloudFileId,
        userId,
        isPrivateFile: false,
      });
    }

    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        ...updateVideoDto,
        normalizedTitle,
        cloudFileId: newCloudVideo.fileId,
        url: newCloudVideo.url,
        thumbnail: newCloudVideo.thumbnail,
        duration: newCloudVideo.duration,
        height: newCloudVideo.height,
        width: newCloudVideo.width,
        size: newCloudVideo.size,
        cloudFilePath: newCloudVideo.filePath,
      },
    });

    return 'Cập nhật video thành công';
  }
}
