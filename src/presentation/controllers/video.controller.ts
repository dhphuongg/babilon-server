import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { CreateVideoDto } from '../dtos/request/video';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { CreateVideoCommand } from 'src/application/commands/video/implements';

@Controller('video')
export class VideoController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
