import { IGetListParams } from 'src/presentation/dtos/request';

export class GetListVideoQuery {
  constructor(
    public readonly userId: string,
    public readonly params: IGetListParams,
  ) {}
}
