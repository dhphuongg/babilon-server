export class DeleteVideoCommand {
  constructor(
    public readonly userId: string,
    public readonly videoId: string,
  ) {}
}
