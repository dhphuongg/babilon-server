import { AuthHandlers } from './auth/handlers';
import { OtpHandlers } from './otp/handlers';

export const CommandHandlers = [...AuthHandlers, ...OtpHandlers];
