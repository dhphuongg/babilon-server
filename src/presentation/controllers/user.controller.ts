import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';

import { UpdateUserByIdCommand } from 'src/application/commands/user/implements';
import { UpdateUserDto } from '../dtos/request/user';
import {
  FollowCommand,
  UnfollowCommand,
} from 'src/application/commands/social-graph/implements';
import { ApiOperation } from '@nestjs/swagger';
import { IGetListParams } from '../dtos/request';
import {
  GetFollowersQuery,
  GetFollowingQuery,
} from 'src/application/queries/user/implements';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get('following')
  @Auth()
  @ApiOperation({ summary: 'Get following' })
  getFollowing(
    @User() { userId }: UserAuth,
    @Query() params: IGetListParams,
  ): Promise<any> {
    return this.queryBus.execute(new GetFollowingQuery(userId, params));
  }

  @Get('followers')
  @Auth()
  @ApiOperation({ summary: 'Get followers' })
  getFollowers(
    @User() { userId }: UserAuth,
    @Query() params: IGetListParams,
  ): Promise<any> {
    return this.queryBus.execute(new GetFollowersQuery(userId, params));
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
