import { AppConstant } from '../constants';

export type MailTemplateSource =
  (typeof AppConstant.Mail.MAIL_TEMPLATE_SOURCES)[keyof typeof AppConstant.Mail.MAIL_TEMPLATE_SOURCES];

export type SendTemplateMailOptions = {
  to: string | string[];
  subject: string;
  template: MailTemplateSource;
  context: Record<string, any>;
  from?: string;
};

export interface IMailService {
  sendMail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<void>;

  sendTemplatedMail(options: SendTemplateMailOptions): Promise<void>;
}

export const MAIL_SERVICE = 'MAIL_SERVICE';
