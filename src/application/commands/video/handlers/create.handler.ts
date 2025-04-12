import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoCommand } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ImageKitService } from 'src/infrastructure/image-kit/image-kit.service';
import { StringUtil } from 'src/infrastructure/common/utils';

@CommandHandler(CreateVideoCommand)
export class CreateVideoHandler implements ICommandHandler<CreateVideoCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageKitService: ImageKitService,
  ) {}

  async execute(command: CreateVideoCommand) {
    const { userId, createVideoDto } = command;

    const result = await this.imageKitService.uploadVideo({
      video: createVideoDto.video,
      userId,
      isPrivateFile: createVideoDto.isPrivate || false,
    });

    await this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        normalizedTitle: StringUtil.normalize(createVideoDto.title),
        isPrivate: createVideoDto.isPrivate,
        url: result.url,
        thumbnail: result.thumbnail,
        duration: result.duration,
        width: result.width,
        height: result.height,
        size: result.size,
        cloudFileId: result.fileId,
        cloudFilePath: result.filePath,
        userId,
      },
    });

    return 'Đăng tải video thành công';
  }
}
