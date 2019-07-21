import { Resolver, Query, FieldResolver, Root, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SchoolRepository } from './school.repository';
import { School } from '../../entity/school.entity';
import { UserRepository } from '../user/user.repository';
import { User, Role } from '../../entity/user.entity';
import { Product } from '../../entity/product.entity';

@Resolver(() => School)
export class SchoolResolver {
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Query(() => [School])
  public async schools() {
    return await this.schoolRepository.find();
  }

  @FieldResolver(() => [User])
  public async users(@Root() school: School) {
    return await this.userRepository.find({ where: { schoolId: school.id } });
  }

  @FieldResolver(() => [Product])
  public async products(@Root() school: School) {
    const foundSchool = await this.schoolRepository.findOne(school.id, { relations: ['products'] });

    if (foundSchool) {
      return foundSchool.products;
    }

    return [];
  }
}
