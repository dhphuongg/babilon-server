import { ICommand } from '@nestjs/cqrs';
import { CreateNotificationDto } from 'src/presentation/dtos/request/notification';

export class CreateNotificationCommand implements ICommand {
  constructor(public readonly createNotificationDto: CreateNotificationDto) {}
}
