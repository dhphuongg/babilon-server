import { GetUserByIdHandler } from './get-by-id.handler';
import { GetUserByUsernameHandler } from './get-by-username.handler';
import { GetFollowersHandler } from './get-followers.handler';
import { GetFollowingHandler } from './get-following.handler';

export const UserQueryHandlers = [
  GetUserByIdHandler,
  GetUserByUsernameHandler,
  GetFollowersHandler,
  GetFollowingHandler,
];
