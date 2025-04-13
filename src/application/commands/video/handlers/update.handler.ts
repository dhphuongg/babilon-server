import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { UpdateVideoCommand } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { StringUtil } from 'src/infrastructure/common/utils';
import {
  CLOUD_STORAGE_PROVIDER,
  ICloudStorageService,
} from 'src/infrastructure/cloud-storage/interface';

@CommandHandler(UpdateVideoCommand)
export class UpdateVideoHandler implements ICommandHandler<UpdateVideoCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLOUD_STORAGE_PROVIDER)
    private readonly cloudStorageService: ICloudStorageService,
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

    // let newCloudVideo: VideoUploadResponse = {
    //   fileId: video.cloudFileId,
    //   url: video.url,
    //   hlsUrl: video.hlsUrl,
    //   thumbnail: video.thumbnail,
    //   duration: video.duration,
    //   height: video.height,
    //   width: video.width,
    //   size: video.size,
    // };
    // if (updateVideoDto.isPrivate && !video.isPrivate) {
    //   newCloudVideo = await this.cloudStorageService.changeVideoPrivateStatus({
    //     fileId: video.cloudFileId,
    //     userId,
    //     isPrivateFile: true,
    //   });
    // } else if (!updateVideoDto.isPrivate && video.isPrivate) {
    //   newCloudVideo = await this.cloudStorageService.changeVideoPrivateStatus({
    //     fileId: video.cloudFileId,
    //     userId,
    //     isPrivateFile: false,
    //   });
    // }

    await this.prisma.video.update({
      where: { id: video.id },
      data: {
        ...updateVideoDto,
        normalizedTitle,
        // cloudFileId: newCloudVideo.fileId,
        // url: newCloudVideo.url,
        // hlsUrl: newCloudVideo.hlsUrl,
        // thumbnail: newCloudVideo.thumbnail,
        // duration: newCloudVideo.duration,
        // height: newCloudVideo.height,
        // width: newCloudVideo.width,
        // size: newCloudVideo.size,
      },
    });

    return 'Cập nhật video thành công';
  }
}
