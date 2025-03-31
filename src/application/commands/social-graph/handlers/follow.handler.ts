import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { NotificationType } from '@prisma/client';

import { FollowCommand } from '../implements';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SOCIAL_GRAPH_REPOSITORY_TOKEN } from 'src/infrastructure/providers/social-graph.repository.provider';
import { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY_TOKEN } from 'src/infrastructure/providers/user.repository.provider';
import { CreateNotificationDto } from 'src/presentation/dtos/request/notification';
import { FcmService } from 'src/infrastructure/fcm/fcm.service';

@CommandHandler(FollowCommand)
export class FollowHandler implements ICommandHandler<FollowCommand> {
  constructor(
    private readonly eventBus: EventBus,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(SOCIAL_GRAPH_REPOSITORY_TOKEN)
    private readonly socialGraphRepository: ISocialGraphRepository,
    private readonly fcmService: FcmService,
  ) {}

  async execute(command: FollowCommand): Promise<any> {
    const { actorId, targetUserId } = command;

    const actor = await this.userRepository.getById(actorId);

    // check target user exists
    const targetUser = await this.userRepository.getById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('Người được theo dõi không tồn tại');
    }

    const isFollowing = await this.socialGraphRepository.isFollowing(
      actorId,
      targetUserId,
    );
    if (isFollowing) {
      // return { message: 'Theo dõi thành công' };
    }

    await this.socialGraphRepository.followByUserId(actorId, targetUserId);

    const notification: CreateNotificationDto = {
      userId: actorId,
      receiverId: targetUserId,
      title: actor!.fullName,
      imageUrl: actor!.avatar || undefined,
      body: `đã bắt đầu theo dõi bạn`,
      type: NotificationType.FOLLOW,
    };
    // this.eventBus.publish(new SendNotificationEvent(notification));
    void this.fcmService.sendNotificationToMultipleDevices({
      tokens: targetUser.deviceTokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
    });

    return { message: 'Theo dõi thành công' };
  }
}
