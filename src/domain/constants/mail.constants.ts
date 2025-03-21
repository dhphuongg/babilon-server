export class MailConstants {
  static readonly MAIL_TEMPLATE_SOURCES = {
    PASSWORD_RESET: 'src/infrastructure/templates/password-reset.ejs',
    REGISTER_VERIFICATION:
      'src/infrastructure/templates/register-verification.ejs',
  } as const;
}
