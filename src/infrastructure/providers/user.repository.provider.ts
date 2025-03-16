import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../repositories/user.repository';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export const UsersRepositoryProvider = {
  provide: USER_REPOSITORY_TOKEN,
  useFactory: (prismaProvider: PrismaService) => {
    return new UserRepository(prismaProvider);
  },
  inject: [PrismaService],
};
