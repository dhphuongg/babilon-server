import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SendMailEvent } from './send-mail.event';

@EventsHandler(SendMailEvent)
export class SendMailHandler implements IEventHandler<SendMailEvent> {
  private readonly logger = new Logger(SendMailHandler.name);

  async handle(event: SendMailEvent) {
    const {
      options: { to, subject },
    } = event;
    const emails = Array.isArray(to) ? to.join(', ') : to;
    this.logger.log(`Send mail: ${emails} - "${subject}"`);
  }
}
