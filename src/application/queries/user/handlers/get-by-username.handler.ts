import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { GetUserByUsernameQuery } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameHandler
  implements IQueryHandler<GetUserByUsernameQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
  ) {}

  async execute(query: GetUserByUsernameQuery): Promise<any> {
    const { username } = query;

    const user = await this.userRepository.getByUsername(username, {
      id: true,
      username: true,
      fullName: true,
      avatar: true,
      signature: true,
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const followers = await this.socialGraphRepository.countFollowersByUserId(
      user.id,
    );
    const followings = await this.socialGraphRepository.countFollowingsByUserId(
      user.id,
    );

    return { ...user, count: { followers, followings } };
  }
}
