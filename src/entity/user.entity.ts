import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { School } from './school.entity';
import { Order } from './order.entity';

@Entity('users')
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column('varchar')
  public firstname: string;

  @Field(() => String)
  @Column('varchar')
  public lastname: string;

  @Field(() => String)
  @Column('varchar')
  public email: string;

  @Column('varchar')
  public password: string;

  @Column('int')
  @Field(() => ID)
  public schoolId: number;

  @ManyToOne(() => School, school => school.users)
  public school: School;

  @OneToMany(() => Order, order => order.user)
  public orders: Order;
}
