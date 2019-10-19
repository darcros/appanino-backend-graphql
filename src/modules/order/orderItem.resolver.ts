import { Resolver, Root, FieldResolver, Float } from 'type-graphql';
import { OrderItem } from '../../entity/orderItem.entity';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  @FieldResolver(() => Float)
  public async subtotal(@Root() item: OrderItem) {
    return (await item.product).price * item.quantity;
  }
}
