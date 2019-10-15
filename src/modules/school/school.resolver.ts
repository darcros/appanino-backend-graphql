import { Resolver, Query, Authorized, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SchoolRepository } from './school.repository';
import { School } from '../../entity/school.entity';
import { Role } from '../../entity/user.entity';

@Resolver(() => School)
export class SchoolResolver {
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;

  @Query(() => [School])
  public async schools() {
    return await this.schoolRepository.find();
  }

  @Authorized(Role.Admin, Role.SchoolAdmin)
  @FieldResolver()
  public async users(@Root() school: School) {
    return school.users;
  }

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @FieldResolver()
  public async products(@Root() school: School) {
    return school.products;
  }
}
