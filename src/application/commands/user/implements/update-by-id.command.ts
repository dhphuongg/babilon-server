import { ICommand } from '@nestjs/cqrs';

import { UpdateUserDto } from 'src/presentation/dtos/request/user';

export class UpdateUserByIdCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly updateUserDto: UpdateUserDto,
  ) {}
}
