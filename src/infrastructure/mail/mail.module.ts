import { Module } from '@nestjs/common';

import { MAIL_SERVICE } from 'src/domain/interfaces/mail.service.interface';
import { MailService } from './mail.service';

@Module({
  providers: [{ provide: MAIL_SERVICE, useClass: MailService }],
  exports: [MAIL_SERVICE],
})
export class MailModule {}
