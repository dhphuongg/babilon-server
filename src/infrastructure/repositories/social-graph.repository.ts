import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';

@Injectable()
export class SocialGraphRepository implements ISocialGraphRepository {
  constructor(private readonly prisma: PrismaService) {}

  followByUserId(actorId: string, targetUserId: string): Promise<void> {
    return this.prisma.$transaction(async (pt) => {
      await pt.socialGraph.update({
        where: { userId: actorId },
        data: { following: { push: targetUserId } },
      });
      await pt.socialGraph.update({
        where: { userId: targetUserId },
        data: { followers: { push: actorId } },
      });
    });
  }

  async unfollowByUserId(actorId: string, targetUserId: string): Promise<void> {
    const actorSocialGraph = await this.prisma.socialGraph.findUnique({
      where: { userId: actorId },
    });
    const targetSocialGraph = await this.prisma.socialGraph.findUnique({
      where: { userId: targetUserId },
    });

    if (!actorSocialGraph || !targetSocialGraph) {
      throw new Error('Social graph not found');
    }

    const actorFollowing = actorSocialGraph.following.filter(
      (userId) => userId !== targetUserId,
    );
    const targetFollowers = targetSocialGraph.followers.filter(
      (userId) => userId !== actorId,
    );

    return this.prisma.$transaction(async (pt) => {
      await pt.socialGraph.update({
        where: { userId: actorId },
        data: { following: actorFollowing },
      });
      await pt.socialGraph.update({
        where: { userId: targetUserId },
        data: { followers: targetFollowers },
      });
    });
  }
}
