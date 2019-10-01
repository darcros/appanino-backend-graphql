import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { School } from './school.entity';
import { Category } from './category.entity';
import { Lazy } from '../database/typeorm.helper';

@Entity('products')
@ObjectType()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column('varchar')
  public name: string;

  @Field(() => Number)
  @Column('decimal')
  public price: number;

  @Field(() => [School])
  @ManyToMany(() => School, school => school.products, { lazy: true })
  @JoinTable({ name: 'schools_products' })
  public schools: Lazy<School[]>;

  @Column('int')
  public categoryId: number;

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.products, { lazy: true })
  public category: Lazy<Category>;
}
