import { CreateVideoDto } from 'src/presentation/dtos/request/video';

export class CreateVideoCommand {
  constructor(
    public readonly userId: string,
    public readonly createVideoDto: CreateVideoDto,
  ) {}
}
