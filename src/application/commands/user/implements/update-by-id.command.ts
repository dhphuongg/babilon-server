import { ICommand } from '@nestjs/cqrs';

import { UpdateUserDto } from 'src/presentation/dtos/user';

export class UpdateUserByIdCommand implements ICommand {
  constructor(
    public readonly userid: string,
    public readonly updateUserDto: UpdateUserDto,
  ) {}
}
