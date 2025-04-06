import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFollowingQuery } from '../implements';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@QueryHandler(GetFollowingQuery)
export class GetFollowingHandler implements IQueryHandler<GetFollowingQuery> {
  constructor(
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetFollowingQuery): Promise<any> {
    const { userId, params } = query;
    const socialGraph = await this.socialGraphRepository.getByUserId(userId);
    const followers = await this.userRepository.getByIdList(
      socialGraph?.following || [],
      {
        params,
        select: {
          id: true,
          username: true,
          avatar: true,
          signature: true,
          fullName: true,
        },
      },
    );
    return { result: followers, ...params };
  }
}
