import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
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

  @OneToMany(() => User, user => user.school)
  public users: User[];

  @ManyToMany(() => Product, product => product.schools)
  public products: Product[];
}
