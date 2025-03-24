import { GetUserByIdHandler } from './get-by-id.handler';
import { GetFollowersHandler } from './get-followers.handler';
import { GetFollowingHandler } from './get-following.handler';

export const UserQueryHandlers = [
  GetUserByIdHandler,
  GetFollowersHandler,
  GetFollowingHandler,
];
