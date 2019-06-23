import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { School } from './school.entity';

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

  @ManyToMany(() => School, school => school.products)
  @JoinTable({ name: 'schools_products' })
  public schools: School[];
}
