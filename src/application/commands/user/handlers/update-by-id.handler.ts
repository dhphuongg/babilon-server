import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { UpdateUserByIdCommand } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { StringUtil } from 'src/infrastructure/common/utils';

@CommandHandler(UpdateUserByIdCommand)
export class UpdateUserByIdHandler
  implements ICommandHandler<UpdateUserByIdCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserByIdCommand): Promise<any> {
    const { userid, updateUserDto } = command;

    // check user by id
    const user = await this.userRepository.getById(userid);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // check username
    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const checkUsername = await this.userRepository.getByUsername(
        updateUserDto.username,
      );
      if (checkUsername) {
        throw new BadRequestException('Tên người dùng đã tồn tại');
      }
    }

    const updatedUser = await this.userRepository.updateById(userid, {
      ...updateUserDto,
      normalizedName: updateUserDto.fullName
        ? StringUtil.normalize(updateUserDto.fullName)
        : user.normalizedName,
    });

    return updatedUser;
  }
}
