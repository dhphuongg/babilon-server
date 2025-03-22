import { PrismaService } from '../prisma/prisma.service';
import { SocialGraphRepository } from '../repositories/social-graph.repository';

export const SOCIAL_GRAPH_REPOSITORY_TOKEN = 'SOCIAL_GRAPH_REPOSITORY_TOKEN';

export const SocialGraphRepositoryProvider = {
  provide: SOCIAL_GRAPH_REPOSITORY_TOKEN,
  useFactory: (prismaProvider: PrismaService) => {
    return new SocialGraphRepository(prismaProvider);
  },
  inject: [PrismaService],
};
