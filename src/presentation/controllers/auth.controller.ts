import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';

import {
  ChangePasswordCommand,
  LoginCommand,
  LogoutCommand,
  RegisterCommand,
  ResetPasswordCommand,
} from 'src/application/commands/auth/implements';
import {
  ChangePasswordDto,
  LoginRequestDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dtos/request/auth';
import { Auth } from 'src/infrastructure/common/decorators/auth.decorator';
import { User } from 'src/infrastructure/common/decorators/user-auth.decorator';
import { UserAuth } from 'src/domain/interfaces/jwt-payload.interface';
import { GetUserByIdQuery } from 'src/application/queries/user/implements';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.commandBus.execute<RegisterCommand>(
      new RegisterCommand(registerDto),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email or username' })
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

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.commandBus.execute(new ResetPasswordCommand(resetPasswordDto));
  }

  @Post('logout')
  @Auth()
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() request: Request): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.commandBus.execute(new LogoutCommand(token));
  }

  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@User() user: UserAuth): Promise<any> {
    return this.queryBus.execute(
      new GetUserByIdQuery(user.userId, {
        id: true,
        fullName: true,
        username: true,
        email: true,
        avatar: true,
        signature: true,
      }),
    );
  }
}
