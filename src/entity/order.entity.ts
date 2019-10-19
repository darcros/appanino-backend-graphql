// This entity indicates the order made by a user

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Lazy } from '../database/typeorm.helper';
import { User } from './user.entity';
import { OrderItem } from './orderItem.entity';

@Entity('orders')
@ObjectType()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number; // Id of the order, auto increment

  @Column('int')
  public userId: number; // Id of the user that made the order

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, item => item.order, { lazy: true, cascade: true })
  public items: Lazy<OrderItem[]>;

  @Field(() => User)
  @ManyToOne(() => User, user => user.orders, { lazy: true })
  public user: Lazy<User>; // Field for Type-Graphql that gives the user info
}
