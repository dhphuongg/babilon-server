import { Body, Controller, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';

import { UpdateUserByIdCommand } from 'src/application/commands/user/implements';
import { UpdateUserDto } from '../dtos/user';

@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  @Auth()
  updateById(
    @User() { userId }: UserAuth,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.commandBus.execute(
      new UpdateUserByIdCommand(userId, updateUserDto),
    );
  }
}
