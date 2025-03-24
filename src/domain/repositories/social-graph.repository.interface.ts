import { SocialGraph } from '@prisma/client';

export interface ISocialGraphRepository {
  getByUserId(userId: string): Promise<SocialGraph | null>;
  followByUserId(actorId: string, targetUserId: string): Promise<void>;
  unfollowByUserId(actorId: string, targetUserId: string): Promise<void>;
}
