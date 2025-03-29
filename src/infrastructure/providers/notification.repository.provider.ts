import { PrismaService } from '../prisma/prisma.service';
import { NotificationRepository } from '../repositories/notification.repository';

export const NOTIFICATION_REPOSITORY_TOKEN = 'NOTIFICATION_REPOSITORY_TOKEN';

export const NotificationRepositoryProvider = {
  provide: NOTIFICATION_REPOSITORY_TOKEN,
  useFactory: (prismaProvider: PrismaService) => {
    return new NotificationRepository(prismaProvider);
  },
  inject: [PrismaService],
};
