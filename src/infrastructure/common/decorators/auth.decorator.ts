import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Protects a route with JWT authentication and optional role-based authorization
 * @param roles Optional roles that are allowed to access the route
 * @example
 *
 * @Auth() // Allow any authenticated user
 *
 * @Auth(Role.ADMIN) // Allow only admin users
 *
 * @Auth(Role.ADMIN, Role.MEMBER) // Allow multiple roles
 */
export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
