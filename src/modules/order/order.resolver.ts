import { Resolver, Query, Authorized, Ctx, Mutation, Arg, FieldResolver, Float, Root, ID } from 'type-graphql';
import { Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Order, OrderStatus } from '../../entity/order.entity';
import { OrderRepository } from './order.repository';
import { Role } from '../../entity/user.entity';
import { LoggedInContext } from '../../util/context.interface';
import { OrderInput } from './order.input';
import { OrderItemRepository } from './orderItem.repository';
import { OrderItemResolver } from './orderItem.resolver';
import { InvalidOrderStatusUpdateError } from './invalidOrderStatusUpdate.error';

const orderStatusAdvancementArray = [
  OrderStatus.Waiting,
  OrderStatus.Preparing,
  OrderStatus.Ready,
  OrderStatus.Delivered,
  // does not include OrderStatus.Canceled because this array is used only for status advancement
];

@Resolver(() => Order)
export class OrderResolver {
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;
  @InjectRepository(OrderItemRepository)
  private readonly orderItemRepository: OrderItemRepository;
  @Inject(() => OrderItemResolver)
  private readonly orderItemResolver: OrderItemResolver;

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

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Mutation(() => Order, { description: 'Cancel an order' })
  public async cancelOrder(@Arg('id', () => ID) id: number) {
    const order = await this.orderRepository.findOneOrFail(id);
    if (order.status !== OrderStatus.Waiting) {
      throw new InvalidOrderStatusUpdateError(`Cannot cancel order that is already being processed`);
    }

    order.status = OrderStatus.Canceled;
    return this.orderRepository.save(order);
  }

  @Authorized(Role.Admin, Role.SchoolAdmin)
  @Mutation(() => Order, { description: 'Change the status of an order' })
  public async advanceOrderStatus(@Arg('id', () => ID) id: number) {
    const order = await this.orderRepository.findOneOrFail(id);

    const position = orderStatusAdvancementArray.indexOf(order.status);
    if (position < 0 || position > orderStatusAdvancementArray.length - 2) {
      throw new InvalidOrderStatusUpdateError(`Cannot advance status`);
    }

    order.status = orderStatusAdvancementArray[position + 1];
    return this.orderRepository.save(order);
  }

  @FieldResolver(() => Float)
  public async total(@Root() order: Order) {
    const prices = await Promise.all((await order.items).map(item => this.orderItemResolver.subtotal(item)));
    return prices.reduce((a, b) => a + b, 0);
  }
}
