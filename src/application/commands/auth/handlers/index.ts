import { ChangePasswordHandler } from './change-password.handler';
import { LoginHandler } from './login.handler';
import { LogoutHandler } from './logout.handler';
import { RegisterHandler } from './register.handler';

export const AuthHandlers = [
  RegisterHandler,
  LoginHandler,
  ChangePasswordHandler,
  LogoutHandler,
];
