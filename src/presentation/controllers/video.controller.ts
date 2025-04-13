import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { CreateVideoDto } from '../dtos/request/video';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import {
  CreateVideoCommand,
  DeleteVideoCommand,
  UpdateVideoCommand,
} from 'src/application/commands/video/implements';
import { IGetListParams } from '../dtos/request';
import { GetListVideoQuery } from 'src/application/queries/video/implements';
import { UpdateVideoDto } from '../dtos/request/video/update.dto';

@Controller('video')
export class VideoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: multer.memoryStorage(),
    }),
  )
  createNewVideo(
    @User() { userId }: UserAuth,
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'video/*' })
        // .addMaxSizeValidator({ maxSize: 10000 })
        .build({ errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE }),
    )
    video: Express.Multer.File,
  ) {
    createVideoDto.video = video;
    return this.commandBus.execute(
      new CreateVideoCommand(userId, createVideoDto),
    );
  }

  @Get()
  @Auth()
  getMyListVideo(
    @User() { userId }: UserAuth,
    @Query() getListParams: IGetListParams,
  ) {
    return this.queryBus.execute(new GetListVideoQuery(userId, getListParams));
  }

  @Patch(':videoId')
  @Auth()
  updateVideo(
    @User() { userId }: UserAuth,
    @Param('videoId') videoId: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.commandBus.execute(
      new UpdateVideoCommand(userId, videoId, updateVideoDto),
    );
  }

  @Delete(':videoId')
  @Auth()
  deleteById(@User() { userId }: UserAuth, @Param('videoId') videoId: string) {
    return this.commandBus.execute(new DeleteVideoCommand(userId, videoId));
  }
}
