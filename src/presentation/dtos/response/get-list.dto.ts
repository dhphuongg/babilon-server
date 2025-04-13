import { IGetListParams } from '../request';

export class GetListResponseDto<I = any> extends IGetListParams {
  items: I[];
  total: number;
}
