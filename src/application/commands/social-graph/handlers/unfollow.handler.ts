import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnfollowCommand } from '../implements';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';

@CommandHandler(UnfollowCommand)
export class UnfollowHandler implements ICommandHandler<UnfollowCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
  ) {}

  async execute(command: UnfollowCommand): Promise<any> {
    const { actorId, targetUserId } = command;

    // check target user exists
    const targetUser = await this.userRepository.getById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Người được theo dõi không tồn tại');
    }

    await this.socialGraphRepository.unfollowByUserId(actorId, targetUserId);

    return { message: 'Huỷ theo dõi thành công' };
  }
}
