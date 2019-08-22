// This entity indicates the order made by a user

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './user.entity';

@Entity('orders')
@ObjectType()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number; // Id of the order, auto increment

  @Field(() => Number)
  @Column('decimal')
  public totalPrice: number; // Total price of the order

  @Column('int')
  public userId: number; // Id of the user that made the order

  @ManyToOne(() => User, user => user.orders)
  public user: User; // Field for Type-Graphql that gives the user info
}
