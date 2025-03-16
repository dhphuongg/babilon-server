import { ICommand } from '@nestjs/cqrs';
import { RegisterDto } from 'src/presentation/dtos/auth';

export class RegisterCommand implements ICommand {
  constructor(readonly registerDto: RegisterDto) {}
}
