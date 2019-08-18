import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Product } from './product.entity';

@Entity('categories')
@ObjectType()
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column('varchar')
  public name: string;

  @OneToMany(() => Product, product => product.category)
  public products: Product[];
}
