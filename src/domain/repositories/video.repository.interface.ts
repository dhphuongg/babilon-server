import { Video } from '@prisma/client';

export interface IVideoRepository {
  getById(id: string): Promise<Video | null>;
}
