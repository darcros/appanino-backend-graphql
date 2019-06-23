import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../entity/user.entity';
import { UserRepository } from './user.repository';
import { SchoolRepository } from '../school/school.repository';
import { School } from '../../entity/school.entity';

@Resolver(() => User)
export class UserResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;

  @Query(() => [User])
  public async users() {
    return await this.userRepository.find();
  }

  @FieldResolver(() => School)
  public async school(@Root() user: User) {
    return await this.schoolRepository.findOne({ where: { id: user.schoolId } });
  }
}
