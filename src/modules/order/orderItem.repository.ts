import { OrderItem } from '../../entity/orderItem.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {}
