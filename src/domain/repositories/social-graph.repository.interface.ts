import { SocialGraph } from '@prisma/client';

export interface ISocialGraphRepository {
  countFollowersByUserId(userId: string): Promise<number>;
  countFollowingsByUserId(userId: string): Promise<number>;
  isFollowing(actorId: string, targetId: string): Promise<boolean>;
  getByUserId(userId: string): Promise<SocialGraph | null>;
  followByUserId(actorId: string, targetUserId: string): Promise<void>;
  unfollowByUserId(actorId: string, targetUserId: string): Promise<void>;
}
