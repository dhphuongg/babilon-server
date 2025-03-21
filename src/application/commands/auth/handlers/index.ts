import { ChangePasswordHandler } from './change-password.handler';
import { LoginHandler } from './login.handler';
import { LogoutHandler } from './logout.handler';
import { RegisterHandler } from './register.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export const AuthHandlers = [
  RegisterHandler,
  LoginHandler,
  ChangePasswordHandler,
  LogoutHandler,
  ResetPasswordHandler,
];
