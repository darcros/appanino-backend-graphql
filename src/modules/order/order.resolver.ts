import { Resolver, Query, FieldResolver, Root, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Order } from '../../entity/order.entity';
import { OrderRepository } from './order.repository';
import { UserRepository } from '../user/user.repository';
import { User, Role } from '../../entity/user.entity';

@Resolver(() => Order)
export class ProductResolver {
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin)
  @Query(() => [Order])
  public async orders() {
    return await this.orderRepository.find();
  }

  @FieldResolver(() => User)
  public async user(@Root() order: Order) {
    return await this.userRepository.findOne({ where: { id: order.userId } });
  }
}
