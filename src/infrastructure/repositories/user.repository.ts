import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/presentation/dtos/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  getById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  getByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  updatePassword(id: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
}
