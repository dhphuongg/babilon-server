import { ICommand } from '@nestjs/cqrs';

import { UpdateUserDto } from 'src/presentation/dtos/request/user';

export class UpdateUserByIdCommand implements ICommand {
  constructor(
    public readonly userid: string,
    public readonly updateUserDto: UpdateUserDto,
  ) {}
}
