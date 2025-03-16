import { IEvent } from '@nestjs/cqrs';

import { SendTemplateMailOptions } from 'src/domain/interfaces/mail.service.interface';

export class SendMailEvent implements IEvent {
  constructor(readonly options: SendTemplateMailOptions) {}
}
