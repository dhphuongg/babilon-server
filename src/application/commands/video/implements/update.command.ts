import { UpdateVideoDto } from 'src/presentation/dtos/request/video/update.dto';

export class UpdateVideoCommand {
  constructor(
    public readonly userId: string,
    public readonly videoId: string,
    public readonly updateVideoDto: UpdateVideoDto,
  ) {}
}
