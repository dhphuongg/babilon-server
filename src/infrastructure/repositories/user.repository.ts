import { Injectable } from '@nestjs/common';
import { OtpType, User } from '@prisma/client';

import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/presentation/dtos/request/user';
import { IGetListParams } from 'src/presentation/dtos/request';
import { GetListResponseDto } from 'src/presentation/dtos/response/get-list.dto';
import { PickSelected, SelectType } from '../common/utils/type.utils';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByIdList<S extends SelectType<User> | undefined>(
    ids: string[],
    {
      params,
      select,
    }: {
      params: IGetListParams;
      select?: S;
    },
  ): Promise<GetListResponseDto<PickSelected<User, S>>> {
    const [total, users] = await Promise.all([
      this.prisma.user.count({ where: { id: { in: ids } } }),
      this.prisma.user.findMany({
        where: { id: { in: ids } },
        select,
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { items: users as PickSelected<User, S>[], total, ...params };
  }

  getById(
    id: string,
    select?: { [key in keyof User]?: boolean },
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id }, select });
  }

  getAllById(
    ids: string[],
    select?: { [key in keyof User]?: boolean },
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select,
    });
  }

  getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  getByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: emailOrUsername }, { email: emailOrUsername }],
      },
    });
  }

  getByUsername(
    username: string,
    select?: { [key in keyof User]?: boolean },
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username }, select });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { otpCode, ...userData } = data;
    return this.prisma.$transaction(async (pt) => {
      const user = await pt.user.create({ data: userData });
      await pt.otp.deleteMany({
        where: { email: user.email, type: OtpType.REGISTER },
      });
      await pt.socialGraph.create({ data: { userId: user.id } });
      return user;
    });
  }

  updatePassword(id: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  updateById(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async addDeviceToken(id: string, deviceToken: string): Promise<User> {
    const isExisted = await this.prisma.user.findFirst({
      where: { id, deviceTokens: { has: deviceToken } },
    });

    return isExisted
      ? isExisted
      : this.prisma.user.update({
          where: { id },
          data: { deviceTokens: { push: deviceToken } },
        });
  }
}
