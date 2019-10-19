import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Lazy } from '../database/typeorm.helper';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('orderItems')
@ObjectType()
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => Int)
  @Column('int')
  public quantity: number;

  @Column('int')
  public productId: number;

  // one-side relation
  @Field(() => Product)
  @ManyToOne(() => Product, { lazy: true })
  public product: Lazy<Product>;

  @Column('int')
  public orderId: number;

  @ManyToOne(() => Order, order => order.items, { lazy: true })
  public order: Lazy<Order>;
}
