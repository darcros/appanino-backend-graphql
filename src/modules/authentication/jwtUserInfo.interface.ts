import { Role } from '../../entity/user.entity';

// User information saved inside the JWT
export interface JwtUserInfo {
  id: number;
  role: Role;
  school: {
    id: number;
    name: string;
  };
}
