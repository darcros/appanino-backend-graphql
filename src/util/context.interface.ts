import { JwtUserInfo } from '../modules/authentication/jwtUserInfo.interface';

export interface Context {
  user?: JwtUserInfo;
}

// Context to be used in resolvers that require authentication
export interface LoggedInContext {
  user: JwtUserInfo;
}
