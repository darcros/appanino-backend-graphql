import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Product } from './product.entity';
import { Lazy } from '../database/typeorm.helper';

@Entity('categories')
@ObjectType()
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column('varchar')
  public name: string;

  @Field(() => [Product])
  @OneToMany(() => Product, product => product.category, { lazy: true })
  public products: Lazy<Product[]>;
}
