import { AuthHandlers } from './auth/handlers';
import { OtpHandlers } from './otp/handlers';
import { SocialGraphHandlers } from './social-graph/handlers';
import { UserHandlers } from './user/handlers';
import { NotificationHandlers } from './notification/handlers';
import { VideoHandlers } from './video/handlers';

export const CommandHandlers = [
  ...AuthHandlers,
  ...OtpHandlers,
  ...UserHandlers,
  ...SocialGraphHandlers,
  ...NotificationHandlers,
  ...VideoHandlers,
];
