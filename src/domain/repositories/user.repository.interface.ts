import { User } from '@prisma/client';

import {
  PickSelected,
  SelectType,
} from 'src/infrastructure/common/utils/type.utils';
import { IGetListParams } from 'src/presentation/dtos/request';

import { CreateUserDto } from 'src/presentation/dtos/request/user';
import { GetListResponseDto } from 'src/presentation/dtos/response/get-list.dto';

export interface IUserRepository {
  getByIdList<S extends SelectType<User> | undefined>(
    ids: string[],
    options: {
      params: IGetListParams;
      select?: S;
    },
  ): Promise<GetListResponseDto<PickSelected<User, S>>>;
  getById<S extends SelectType<User> | undefined>(
    id: string,
    select?: S,
  ): Promise<PickSelected<User, S> | null>;
  getAllById(
    ids: string[],
    select?: { [key in keyof User]?: boolean },
  ): Promise<User[]>;
  getByEmail(email: string): Promise<User | null>;
  getByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
  getByUsername(
    username: string,
    select?: { [key in keyof User]?: boolean },
  ): Promise<User | null>;
  createUser(data: CreateUserDto): Promise<User>;
  updatePassword(id: string, newPassword: string): Promise<User>;
  updateById(id: string, data: Partial<User>): Promise<User>;
  addDeviceToken(id: string, deviceToken: string): Promise<User>;
}
