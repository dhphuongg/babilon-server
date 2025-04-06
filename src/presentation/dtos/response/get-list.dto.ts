import { IGetListParams } from '../request';

export class GetListResponseDto<I> extends IGetListParams {
  items: I[];
  total: number;
}
