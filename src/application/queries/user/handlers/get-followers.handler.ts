import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFollowersQuery } from '../implements';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { UserResponseDto } from 'src/presentation/dtos/response/user/get-user.dto';

@QueryHandler(GetFollowersQuery)
export class GetFollowersHandler implements IQueryHandler<GetFollowersQuery> {
  constructor(
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetFollowersQuery): Promise<any> {
    const { curUserId, userId, params } = query;
    const socialGraph = await this.socialGraphRepository.getByUserId(userId);
    const { items: followers, ...rest } = await this.userRepository.getByIdList(
      socialGraph?.followers || [],
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

    const items: UserResponseDto[] = [];

    for (const follower of followers) {
      const followerCount =
        await this.socialGraphRepository.countFollowersByUserId(userId);
      const followingCount =
        await this.socialGraphRepository.countFollowingsByUserId(userId);

      const isFollowing = await this.socialGraphRepository.isFollowing(
        curUserId,
        follower.id,
      );
      const isFollower = await this.socialGraphRepository.isFollower(
        curUserId,
        follower.id,
      );

      items.push({
        ...follower,
        followerCount,
        followingCount,
        isMe: curUserId === follower.id,
        isFollowing,
        isFollower,
      });
    }

    return { items, ...rest };
  }
}
