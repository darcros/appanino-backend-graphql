import { AuthChecker } from 'type-graphql';
import { Context } from '../../util/context.interface';
import { Role } from '../../entity/user.entity';

export const customAuthChecker: AuthChecker<Context, Role> = ({ context: { user } }, roles) => {
  // If the user is not logged in
  if (!user) return false;

  // If `@Authorized()` without roles
  if (roles.length == 0) return true;

  // Check if user role is present in roles
  if (roles.includes(user.role)) {
    return true;
  }

  return false;
};
