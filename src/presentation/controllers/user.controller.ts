import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';

import { UpdateUserByIdCommand } from 'src/application/commands/user/implements';
import { UpdateUserDto } from '../dtos/user';
import {
  FollowCommand,
  UnfollowCommand,
} from 'src/application/commands/social-graph/implements';

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

  @Post('follow/:userId')
  @Auth()
  @HttpCode(HttpStatus.OK)
  followUserById(
    @Param('userId') targetUserId: string,
    @User() { userId: actorId }: UserAuth,
  ) {
    return this.commandBus.execute(new FollowCommand(actorId, targetUserId));
  }

  @Post('unfollow/:userId')
  @Auth()
  @HttpCode(HttpStatus.OK)
  unfollowUserById(
    @Param('userId') targetUserId: string,
    @User() { userId: actorId }: UserAuth,
  ) {
    return this.commandBus.execute(new UnfollowCommand(actorId, targetUserId));
  }
}
