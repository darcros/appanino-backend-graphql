import { Resolver, Arg, Mutation } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../../entity/user.entity';
import { UserRepository } from '../../user/user.repository';
import { LOGIN_FAILED } from './login.error';

@Resolver()
export class LoginResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Mutation(() => User)
  public async login(@Arg('email') email: string, @Arg('password') password: string) {
    const isUserFound = await this.userRepository.findOne({ where: { email, password } });

    if (isUserFound) {
      return isUserFound;
    } else {
      throw LOGIN_FAILED;
    }
  }
}
