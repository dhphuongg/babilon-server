import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { UpdateUserByIdCommand } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { StringUtil } from 'src/infrastructure/common/utils';
import { GetUserByIdQuery } from 'src/application/queries/user/implements';

@CommandHandler(UpdateUserByIdCommand)
export class UpdateUserByIdHandler
  implements ICommandHandler<UpdateUserByIdCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly queryBus: QueryBus,
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

    const avatar = `images/${updateUserDto.avatar?.filename}`;

    const updatedUser = await this.userRepository.updateById(userid, {
      ...updateUserDto,
      avatar: updateUserDto.avatar ? avatar : user.avatar,
      normalizedName: updateUserDto.fullName
        ? StringUtil.normalize(updateUserDto.fullName)
        : user.normalizedName,
    });

    return this.queryBus.execute(new GetUserByIdQuery(updatedUser.id));
  }
}
