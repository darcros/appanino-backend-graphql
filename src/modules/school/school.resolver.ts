import { Resolver, Query, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SchoolRepository } from './school.repository';
import { School } from '../../entity/school.entity';
import { Role } from '../../entity/user.entity';

@Resolver(() => School)
export class SchoolResolver {
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Query(() => [School])
  public async schools() {
    return await this.schoolRepository.find();
  }
}
