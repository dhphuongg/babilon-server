import { ICommand } from '@nestjs/cqrs';
import { ResetPasswordDto } from 'src/presentation/dtos/auth';

export class ResetPasswordCommand implements ICommand {
  constructor(public readonly resetPasswordDto: ResetPasswordDto) {}
}
