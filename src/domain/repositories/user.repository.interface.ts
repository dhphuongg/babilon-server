import { User } from '@prisma/client';

import { CreateUserDto } from 'src/presentation/dtos/user';

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserDto): Promise<User>;
  updatePassword(studentCode: string, newPassword: string): Promise<User>;
}
