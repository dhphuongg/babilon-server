import { ICommand } from '@nestjs/cqrs';

export class FollowCommand implements ICommand {
  constructor(
    public readonly actorId: string,
    public readonly targetUserId: string,
  ) {}
}
