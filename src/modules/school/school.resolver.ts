import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SchoolRepository } from './school.repository';
import { School } from '../../entity/school.entity';
import { UserRepository } from '../user/user.repository';
import { User } from '../../entity/user.entity';

@Resolver(() => School)
export class SchoolResolver {
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Query(() => [School])
  public async schools() {
    return await this.schoolRepository.find();
  }

  @FieldResolver(() => [User])
  public async users(@Root() school: School) {
    return await this.userRepository.find({ where: { schoolId: school.id } });
  }
}
