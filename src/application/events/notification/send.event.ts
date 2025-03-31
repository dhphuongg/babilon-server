import { IEvent } from '@nestjs/cqrs';
import { MulticastMessage } from 'firebase-admin/messaging';

import { CreateNotificationDto } from 'src/presentation/dtos/request/notification';

export class SendNotificationEvent implements IEvent {
  constructor(
    public readonly createNotificationDto: CreateNotificationDto,
    public readonly fcmData?: Omit<MulticastMessage, 'tokens'>,
  ) {}
}
