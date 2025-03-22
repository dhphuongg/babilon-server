import { AuthHandlers } from './auth/handlers';
import { OtpHandlers } from './otp/handlers';
import { UserHandlers } from './user/handlers';

export const CommandHandlers = [
  ...AuthHandlers,
  ...OtpHandlers,
  ...UserHandlers,
];
