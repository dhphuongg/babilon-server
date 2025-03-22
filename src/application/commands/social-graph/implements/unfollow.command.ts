import { ICommand } from '@nestjs/cqrs';

export class UnfollowCommand implements ICommand {
  constructor(
    public readonly actorId: string,
    public readonly targetUserId: string,
  ) {}
}
