import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
