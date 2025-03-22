import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FollowCommand } from '../implements';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@CommandHandler(FollowCommand)
export class FollowHandler implements ICommandHandler<FollowCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
  ) {}

  async execute(command: FollowCommand): Promise<any> {
    const { actorId, targetUserId } = command;

    // check target user exists
    const targetUser = await this.userRepository.getById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Người được theo dõi không tồn tại');
    }

    await this.socialGraphRepository.followByUserId(actorId, targetUserId);

    return { message: 'Theo dõi thành công' };
  }
}
