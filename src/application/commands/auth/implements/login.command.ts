import { LoginRequestDto } from 'src/presentation/dtos/auth/login.dto';

export class LoginCommand {
  constructor(readonly loginRequestDto: LoginRequestDto) {}
}
