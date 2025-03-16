import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ChangePasswordCommand,
  LoginCommand,
  LogoutCommand,
  RegisterCommand,
} from 'src/application/commands/auth/implements';
import { ChangePasswordDto, LoginRequestDto, RegisterDto } from '../dtos/auth';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';
import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Student register with form' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.diskStorage({
        destination(req, file, callback) {
          const dest = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          callback(null, dest);
        },
        filename(req, file, callback) {
          callback(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        // .addMaxSizeValidator({ maxSize: 1000 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        }),
    )
    avatar?: Express.Multer.File,
  ): Promise<any> {
    registerDto.avatar = avatar;
    return this.commandBus.execute<RegisterCommand>(
      new RegisterCommand(registerDto),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with student code and password' })
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<any> {
    const command = new LoginCommand(loginRequestDto);
    const result = await this.commandBus.execute<LoginCommand>(command);

    return result;
  }

  @Post('change-password')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user: UserAuth,
  ): Promise<any> {
    return this.commandBus.execute(
      new ChangePasswordCommand(user.userId, changePasswordDto),
    );
  }

  @Post('logout')
  @Auth()
  @ApiOperation({ summary: 'Logout' })
  async logout(@User() user: UserAuth): Promise<any> {
    return this.commandBus.execute(new LogoutCommand(user.userId));
  }

  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@User() user: UserAuth) {
    return user;
  }
}
