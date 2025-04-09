import { IQuery } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { SelectType } from 'src/infrastructure/common/utils/type.utils';

export class GetUserByIdQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly select?: SelectType<User>,
    public readonly curUserId?: string,
  ) {}
}
