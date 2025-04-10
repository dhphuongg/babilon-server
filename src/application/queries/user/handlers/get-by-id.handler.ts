import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { GetUserByIdQuery } from '../implements';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { UserResponseDto } from 'src/presentation/dtos/response/user/get-user.dto';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponseDto> {
    const { userId, select, curUserId } = query;

    const user = await this.userRepository.getById(userId, select);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const followerCount =
      await this.socialGraphRepository.countFollowersByUserId(userId);
    const followingCount =
      await this.socialGraphRepository.countFollowingsByUserId(userId);

    if (curUserId) {
      const isFollower = await this.socialGraphRepository.isFollower(
        curUserId,
        userId,
      );

      const isFollowing = await this.socialGraphRepository.isFollowing(
        curUserId,
        userId,
      );

      return {
        ...user,
        followerCount,
        followingCount,
        isMe: curUserId === userId,
        isFollower,
        isFollowing,
      };
    }

    return { ...user, followerCount, followingCount };
  }
}
