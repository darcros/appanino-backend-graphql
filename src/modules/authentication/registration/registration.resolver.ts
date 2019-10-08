import { Resolver, Mutation, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../user/user.repository';
import { User } from '../../../entity/user.entity';
import { UserRegistrationInput } from './registration.input';

@Resolver()
export class RegistrationResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Mutation(() => User, { description: 'creates a new user' })
  public async register(@Arg('userRegistrationData') userRegistrationData: UserRegistrationInput) {
    const newUser = this.userRepository.create(userRegistrationData);
    return this.userRepository.save(newUser);
  }
}
