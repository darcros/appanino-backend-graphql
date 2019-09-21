import { Resolver, Query, Authorized } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Order } from '../../entity/order.entity';
import { OrderRepository } from './order.repository';
import { Role } from '../../entity/user.entity';

@Resolver(() => Order)
export class ProductResolver {
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin)
  @Query(() => [Order])
  public async orders() {
    return await this.orderRepository.find();
  }
}
