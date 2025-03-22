export interface ISocialGraphRepository {
  followByUserId(actorId: string, targetUserId: string): Promise<void>;
}
