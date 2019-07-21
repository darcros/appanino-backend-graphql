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
      relations: ['school'],
    });

    if (!foundUser) {
      throw LOGIN_FAILED;
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      throw LOGIN_FAILED;
    }

    const { id, role, school } = foundUser;
    const userData: JwtUserInfo = {
      id,
      role,
      school: {
        id: school.id,
        name: school.name,
      },
    };

    // TODO: read secret from environment variable
    const token = jwt.sign(userData, 'SECRET', {
      // audience: '',
      // issuer: '',
      expiresIn: '2 days',
    });

    return token;
  }
}
