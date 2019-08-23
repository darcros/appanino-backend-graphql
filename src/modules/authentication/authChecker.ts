import { AuthChecker } from 'type-graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

import { Context } from '../../util/context.interface';
import { Role } from '../../entity/user.entity';

export const customAuthChecker: AuthChecker<Context, Role> = ({ context: { user } }, roles) => {
  // If the user is not logged in
  if (!user) {
    throw new AuthenticationError('Not authenticated');
  }

  // If `@Authorized()` without roles
  if (roles.length === 0) return true;

  // Check if user role is present in roles
  if (roles.includes(user.role)) {
    return true;
  }

  throw new ForbiddenError('Action not permitted');
};
