export const MAIL_TEMPLATE_SOURCES = {
  WELCOME: 'src/infrastructure/templates/welcome.ejs',
  RECRUIT_INFORMATION: 'src/infrastructure/templates/recruit-information.ejs',
  RESET_PASSWORD: 'src/infrastructure/templates/reset-password.ejs',
  VERIFICATION: 'src/infrastructure/templates/verification.ejs',
} as const;

export type MailTemplateSource =
  (typeof MAIL_TEMPLATE_SOURCES)[keyof typeof MAIL_TEMPLATE_SOURCES];
