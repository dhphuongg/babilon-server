export interface ISocialGraphRepository {
  followByUserId(actorId: string, targetUserId: string): Promise<void>;
  unfollowByUserId(actorId: string, targetUserId: string): Promise<void>;
}
