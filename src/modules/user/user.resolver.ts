import { Resolver, Query } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../entity/user.entity';
import { UserRepository } from './user.repository';

@Resolver(() => User)
export class UserResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Query(() => [User])
  public async users() {
    return await this.userRepository.find();
  }
}
