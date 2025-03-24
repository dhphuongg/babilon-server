import { LoginRequestDto } from 'src/presentation/dtos/request/auth/login.dto';

export class LoginCommand {
  constructor(readonly loginRequestDto: LoginRequestDto) {}
}
