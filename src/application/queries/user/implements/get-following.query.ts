import { IQuery } from '@nestjs/cqrs';

import { IGetListParams } from 'src/presentation/dtos/request';

export class GetFollowingQuery implements IQuery {
  constructor(
    public readonly curUserId: string,
    public readonly userId: string,
    public readonly params: IGetListParams,
  ) {}
}
