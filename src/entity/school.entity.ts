import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './user.entity';

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
}
