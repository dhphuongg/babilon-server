import { INotificationRepository } from 'src/domain/repositories/notification.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';
import { CreateNotificationDto } from 'src/presentation/dtos/request/notification';

export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }
}
