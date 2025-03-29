import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { IVideoRepository } from 'src/domain/repositories/video.repository.interface';
import { Video } from '@prisma/client';

@Injectable()
export class VideoRepository implements IVideoRepository {
  constructor(private readonly prisma: PrismaService) {}

  getById(id: string): Promise<Video | null> {
    return this.prisma.video.findUnique({ where: { id } });
  }
}
