import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { GetUserByIdQuery } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<any> {
    const { userId } = query;

    const user = await this.userRepository.getById(userId, {
      id: true,
      username: true,
      fullName: true,
      normalizedName: true,
      email: true,
      avatar: true,
      signature: true,
      createdAt: true,
      updatedAt: true,
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const followers =
      await this.socialGraphRepository.countFollowersByUserId(userId);
    const followings =
      await this.socialGraphRepository.countFollowingsByUserId(userId);

    return { ...user, count: { followers, followings } };
  }
}
