import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Lazy } from '../database/typeorm.helper';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('schools')
@ObjectType()
export class School {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column('varchar')
  public name: string;

  @Field(() => [User])
  @OneToMany(() => User, user => user.school, { lazy: true })
  public users: Lazy<User[]>;

  @Field(() => [Product])
  @ManyToMany(() => Product, product => product.schools, { lazy: true })
  public products: Lazy<Product[]>;
}
