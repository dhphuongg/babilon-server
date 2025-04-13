import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetListVideoQuery } from '../implements';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { GetListResponseDto } from 'src/presentation/dtos/response/get-list.dto';

@QueryHandler(GetListVideoQuery)
export class GetListVideoHandler implements ICommandHandler<GetListVideoQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetListVideoQuery): Promise<GetListResponseDto> {
    const { userId, params } = query;

    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.video.count({
        where: {
          userId,
        },
      }),
    ]);

    return { items: videos, total, ...params };
  }
}
