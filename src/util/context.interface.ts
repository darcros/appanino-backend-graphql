import { JwtUserInfo } from '../modules/authentication/jwtUserInfo.interface';

export interface Context {
  user?: JwtUserInfo;
}
