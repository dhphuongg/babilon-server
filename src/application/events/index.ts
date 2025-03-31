import { SendNotificationHandler } from './notification/send.handler';
import { SendMailHandler } from './send-mail/send-mail.handler';

export const EventHandlers = [SendMailHandler, SendNotificationHandler];
