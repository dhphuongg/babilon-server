import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ISocialGraphRepository } from 'src/domain/repositories/social-graph.repository.interface';
import { SocialGraph } from '@prisma/client';

@Injectable()
export class SocialGraphRepository implements ISocialGraphRepository {
  constructor(private readonly prisma: PrismaService) {}

  countFollowersByUserId(userId: string): Promise<number> {
    return this.prisma.socialGraph.count({
      where: { following: { has: userId } },
    });
  }

  countFollowingsByUserId(userId: string): Promise<number> {
    return this.prisma.socialGraph.count({
      where: { followers: { has: userId } },
    });
  }

  async isFollowing(actorId: string, targetId: string): Promise<boolean> {
    const isFollowing = await this.prisma.socialGraph.findFirst({
      where: { userId: actorId, following: { has: targetId } },
    });
    return !!isFollowing;
  }

  getByUserId(userId: string): Promise<SocialGraph | null> {
    return this.prisma.socialGraph.findUnique({ where: { userId } });
  }

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
