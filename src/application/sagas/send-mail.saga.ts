import { Injectable, Inject, Logger } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  IMailService,
  MAIL_SERVICE,
  SendTemplateMailOptions,
} from 'src/domain/interfaces/mail.service.interface';
import { SendMailEvent } from '../events/send-mail/send-mail.event';

const MAX_RETRIES = 3;

@Injectable()
export class SendMailSaga {
  private readonly logger = new Logger(SendMailSaga.name);

  constructor(
    @Inject(MAIL_SERVICE)
    private readonly mailService: IMailService,
  ) {}

  @Saga()
  sendMailSaga = (
    events$: Observable<SendMailEvent>,
  ): Observable<void | undefined> => {
    return events$.pipe(
      ofType(SendMailEvent), // filter the event
      // invoke when the event is received
      switchMap((event: SendMailEvent) => {
        return from(this.sendEmailWithRetry(event.options, 0));
      }),
    );
  };

  private async sendEmailWithRetry(
    options: SendTemplateMailOptions,
    attempt: number,
  ): Promise<void> {
    try {
      await this.mailService.sendTemplatedMail(options);
      const emails = Array.isArray(options.to)
        ? options.to.join(', ')
        : options.to;
      this.logger.log(`✅ Mail "${options.subject}" sent to ${emails}`);
    } catch (error: any) {
      // retry if failed
      if (attempt < MAX_RETRIES) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential Backoff (1s, 2s, 4s...)
        this.logger.warn(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `❌ Attempt ${attempt + 1}/${MAX_RETRIES} failed: ${error.message}, retrying in ${waitTime}ms...`,
        );

        // retry after delay
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.sendEmailWithRetry(options, attempt + 1);
      }

      this.logger.error(
        `🚨 Failed to send email after ${MAX_RETRIES} attempts`,
      );
    }
  }
}
