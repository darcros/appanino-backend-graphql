import { Resolver, Arg, Mutation } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../../user/user.repository';
import { LOGIN_FAILED } from './login.error';
import { JwtUserInfo } from '../jwtUserInfo.interface';

@Resolver()
export class LoginResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Mutation(() => String, { description: 'Returns a jwt to use for authentication' })
  public async login(@Arg('email') LoginEmail: string, @Arg('password') password: string) {
    const foundUser = await this.userRepository.findOne({
      where: { email: LoginEmail },
    });

    if (!foundUser) {
      throw LOGIN_FAILED;
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      throw LOGIN_FAILED;
    }

    const { id, role } = foundUser;
    const school = await foundUser.school;

    const userData: JwtUserInfo = {
      id,
      role,
      school: {
        id: school.id,
        name: school.name,
      },
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET || 'SECRET', {
      // audience: '',
      // issuer: '',
      expiresIn: '2 days',
    });

    return token;
  }
}
