import { UserQueryHandlers } from './user/handlers';
import { VideoQueryHandlers } from './video/handlers';

export const QueryHandlers = [...UserQueryHandlers, ...VideoQueryHandlers];
