import { ICommand } from '@nestjs/cqrs';

import { ChangePasswordDto } from 'src/presentation/dtos/request/auth';

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly changePasswordDto: ChangePasswordDto,
  ) {}
}
