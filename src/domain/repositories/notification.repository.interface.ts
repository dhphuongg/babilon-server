import { Notification } from '@prisma/client';
import { CreateNotificationDto } from 'src/presentation/dtos/request/notification';

export interface INotificationRepository {
  create(body: CreateNotificationDto): Promise<Notification>;
}
