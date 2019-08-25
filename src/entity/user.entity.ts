import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import * as bcrypt from 'bcrypt';

import { School } from './school.entity';
import { Order } from './order.entity';

export enum Role {
  // Normal user
  User = 'User',

  // School admin aka Paninaro
  SchoolAdmin = 'SchoolAdmin',

  // System Admin
  Admin = 'Admin',
}

// I have to register the type this way because decorators only work on classes
registerEnumType(Role, {
  name: 'Role',
});

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

  @Column({ type: 'varchar', default: Role.User })
  @Field(() => Role)
  public role: Role;

  @Column('int')
  public schoolId: number;

  @ManyToOne(() => School, school => school.users)
  public school: School;

  @OneToMany(() => Order, order => order.user)
  public orders: Order;

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    console.log('-----------------------------------------------------------------------');
    this.password = await bcrypt.hash(this.password, 10);
  }
}
