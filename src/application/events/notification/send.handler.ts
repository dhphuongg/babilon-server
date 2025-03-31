import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendNotificationEvent } from './send.event';
import { FcmService } from 'src/infrastructure/fcm/fcm.service';
import { Inject } from '@nestjs/common';
import { INotificationRepository } from 'src/domain/repositories/notification.repository.interface';
import { NOTIFICATION_REPOSITORY_TOKEN } from 'src/infrastructure/providers/notification.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@EventsHandler(SendNotificationEvent)
export class SendNotificationHandler
  implements IEventHandler<SendNotificationEvent>
{
  constructor(
    private readonly fcmService: FcmService,
    @Inject(NOTIFICATION_REPOSITORY_TOKEN)
    private readonly notificationRepository: INotificationRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async handle(event: SendNotificationEvent) {
    const { createNotificationDto, fcmData } = event;

    const notification = await this.notificationRepository.create(
      createNotificationDto,
    );

    const receiver = await this.userRepository.getById(
      notification.receiverId,
      { deviceTokens: true },
    );

    return this.fcmService.sendNotificationToMultipleDevices({
      tokens: receiver!.deviceTokens,
      ...(fcmData?.notification && {
        notification: {
          title: notification.title,
          body: notification.body,
          imageUrl: notification.imageUrl ?? undefined,
        },
      }),
      ...(fcmData?.data && { data: {} }),
      ...(fcmData?.android && {
        android: { notification: { sound: 'sound_default.wav' } },
      }),
      ...(fcmData?.apns && { apns: {} }),
      ...(fcmData?.webpush && { webpush: {} }),
    });
  }
}
