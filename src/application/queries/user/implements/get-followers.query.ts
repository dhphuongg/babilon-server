import { IQuery } from '@nestjs/cqrs';

import { IGetListParams } from 'src/presentation/dtos/request';

export class GetFollowersQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly params: IGetListParams,
  ) {}
}
