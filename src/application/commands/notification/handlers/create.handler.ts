import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateNotificationCommand } from '../implements/create.command';
import { NOTIFICATION_REPOSITORY_TOKEN } from 'src/infrastructure/providers/notification.repository.provider';
import { INotificationRepository } from 'src/domain/repositories/notification.repository.interface';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler
  implements ICommandHandler<CreateNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_TOKEN)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<any> {
    const { createNotificationDto } = command;
    return await this.notificationRepository.create(createNotificationDto);
  }
}
