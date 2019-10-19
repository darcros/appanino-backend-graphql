import { Resolver, Query, Authorized, Ctx, Mutation, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Order } from '../../entity/order.entity';
import { OrderRepository } from './order.repository';
import { Role } from '../../entity/user.entity';
import { LoggedInContext } from '../../util/context.interface';
import { OrderInput } from './order.input';
import { OrderItemRepository } from './orderItem.repository';

@Resolver(() => Order)
export class ProductResolver {
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;
  @InjectRepository(OrderItemRepository)
  private readonly orderItemRepository: OrderItemRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin)
  @Query(() => [Order])
  public async orders() {
    return await this.orderRepository.find();
  }

  @Authorized(Role.User)
  @Mutation(() => Order)
  public async placeOrder(@Ctx() context: LoggedInContext, @Arg('orderData') input: OrderInput) {
    const order = this.orderRepository.create({
      userId: context.user.id,
    });
    await this.orderRepository.save(order);

    const items = input.items.map(({ quantity, productId }) =>
      this.orderItemRepository.create({ order, productId, quantity }),
    );
    await this.orderItemRepository.save(items);

    // update the object locally to save another read from the DB
    order.items = items;
    return order;
  }
}
