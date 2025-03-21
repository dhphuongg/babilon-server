import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { GetUserByIdQuery } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<any> {
    const { userId } = query;

    const user = await this.userRepository.getById(userId, {
      id: true,
      username: true,
      fullName: true,
      email: true,
      avatar: true,
      signature: true,
      createdAt: true,
      updatedAt: true,
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    return user;
  }
}
