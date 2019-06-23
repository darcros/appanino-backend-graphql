import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

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
}
