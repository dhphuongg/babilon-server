import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';

import { UpdateUserByIdCommand } from 'src/application/commands/user/implements';
import { UpdateUserDto } from '../dtos/request/user';
import {
  FollowCommand,
  UnfollowCommand,
} from 'src/application/commands/social-graph/implements';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { IGetListParams } from '../dtos/request';
import {
  GetFollowersQuery,
  GetFollowingQuery,
  GetUserByUsernameQuery,
} from 'src/application/queries/user/implements';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Patch()
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.diskStorage({
        destination(_, __, callback) {
          const dest = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

          callback(null, dest);
        },
        filename(_, file, callback) {
          callback(null, `${randomUUID()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  updateById(
    @User() { userId }: UserAuth,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        // .addMaxSizeValidator({ maxSize: 10000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          fileIsRequired: false,
        }),
    )
    avatar?: Express.Multer.File,
  ): Promise<any> {
    if (avatar) {
      updateUserDto.avatar = avatar;
    }
    return this.commandBus.execute(
      new UpdateUserByIdCommand(userId, updateUserDto),
    );
  }

  @Get('following/:userId')
  @Auth()
  @ApiOperation({ summary: 'Get followings by user id' })
  getFollowing(
    @Param('userId') userId: string,
    @Query() params: IGetListParams,
  ): Promise<any> {
    return this.queryBus.execute(new GetFollowingQuery(userId, params));
  }

  @Get('followers/:userId')
  @Auth()
  @ApiOperation({ summary: 'Get followers by user id' })
  getFollowers(
    @Param('userId') userId: string,
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

  @Get('/:username')
  getByUsername(@Param('username') username: string) {
    return this.queryBus.execute(new GetUserByUsernameQuery(username));
  }
}
