import { Injectable } from '@nestjs/common';
import { OtpType, User } from '@prisma/client';

import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/presentation/dtos/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  getById(
    id: string,
    select?: { [key in keyof User]?: boolean },
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id }, select });
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

  getByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { otpCode, ...userData } = data;
    return this.prisma.$transaction(async (pt) => {
      const user = await pt.user.create({ data: userData });
      await pt.otp.deleteMany({
        where: { email: user.email, type: OtpType.REGISTER },
      });
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
}
