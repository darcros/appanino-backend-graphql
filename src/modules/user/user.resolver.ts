import { Resolver, Query, FieldResolver, Root, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, Role } from '../../entity/user.entity';
import { UserRepository } from './user.repository';
import { SchoolRepository } from '../school/school.repository';
import { School } from '../../entity/school.entity';
import { Order } from '../../entity/order.entity';
import { OrderRepository } from '../order/order.repository';

@Resolver(() => User)
export class UserResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Authorized(Role.Admin)
  @Query(() => [User])
  public async users() {
    return await this.userRepository.find();
  }

  @FieldResolver(() => School)
  public async school(@Root() user: User) {
    return await this.schoolRepository.findOne({ where: { id: user.schoolId } });
  }

  @FieldResolver(() => [Order])
  public async orders(@Root() user: User) {
    return await this.orderRepository.find({ where: { userId: user.id } });
  }
}
