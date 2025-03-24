import { User } from '@prisma/client';
import { IGetListParams } from 'src/presentation/dtos/request';

import { CreateUserDto } from 'src/presentation/dtos/request/user';

export interface IUserRepository {
  getByIdList(
    ids: string[],
    options: {
      params: IGetListParams;
      select?: { [key in keyof User]?: boolean };
    },
  ): Promise<User[]>;
  getById(
    id: string,
    select?: { [key in keyof User]?: boolean },
  ): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  createUser(data: CreateUserDto): Promise<User>;
  updatePassword(id: string, newPassword: string): Promise<User>;
  updateById(id: string, data: Partial<User>): Promise<User>;
}
