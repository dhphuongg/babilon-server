import { PrismaService } from '../prisma/prisma.service';
import { VideoRepository } from '../repositories/video.repository';

export const VIDEO_REPOSITORY_TOKEN = 'VIDEO_REPOSITORY_TOKEN';

export const VideoRepositoryProvider = {
  provide: VIDEO_REPOSITORY_TOKEN,
  useFactory: (prismaProvider: PrismaService) => {
    return new VideoRepository(prismaProvider);
  },
  inject: [PrismaService],
};
