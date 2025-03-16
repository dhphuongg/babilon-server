import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterCommand } from '../implements';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { AppConstant } from 'src/domain/constants';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: RegisterCommand): Promise<any> {
    const { registerDto } = command;

    const userFound = await this.userRepository.getByEmail(registerDto.email);
    if (userFound) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      AppConstant.Auth.PASSWORD_SALT,
    );

    await this.userRepository.createUser({
      ...registerDto,
      password: hashedPassword,
      avatar: registerDto.avatar?.filename,
    });

    return { message: 'Đăng ký thành công' };
  }
}
