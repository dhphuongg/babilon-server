import { GetUserByIdHandler } from './get-by-id.handler';
import { GetFollowersHandler } from './get-followers.handler';

export const UserQueryHandlers = [GetUserByIdHandler, GetFollowersHandler];
