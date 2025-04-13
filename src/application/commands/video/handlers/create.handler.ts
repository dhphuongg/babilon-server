import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoCommand } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { StringUtil } from 'src/infrastructure/common/utils';
import {
  CLOUD_STORAGE_PROVIDER,
  ICloudStorageService,
} from 'src/infrastructure/cloud-storage/interface';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateVideoCommand)
export class CreateVideoHandler implements ICommandHandler<CreateVideoCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLOUD_STORAGE_PROVIDER)
    private readonly cloudStorageService: ICloudStorageService,
  ) {}

  async execute(command: CreateVideoCommand) {
    const { userId, createVideoDto } = command;

    const result = await this.cloudStorageService.uploadVideo({
      video: createVideoDto.video,
      userId,
      isPrivate: createVideoDto.isPrivate || false,
    });

    await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        normalizedTitle: StringUtil.normalize(createVideoDto.title),
        isPrivate: createVideoDto.isPrivate,
        url: result.url,
        hlsUrl: result.hlsUrl,
        thumbnail: result.thumbnail,
        duration: result.duration,
        width: result.width,
        height: result.height,
        size: result.size,
        cloudFileId: result.fileId,
        userId,
      },
    });

    return 'Đăng tải video thành công';
  }
}
