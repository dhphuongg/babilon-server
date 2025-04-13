import { CreateVideoHandler } from './create.handler';
import { DeleteVideoHandler } from './delete.handler';
import { UpdateVideoHandler } from './update.handler';

export const VideoHandlers = [
  CreateVideoHandler,
  UpdateVideoHandler,
  DeleteVideoHandler,
];
