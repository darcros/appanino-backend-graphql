import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  public firstname?: string;

  @Field(() => String, { nullable: true })
  public lastname?: string;

  @Field(() => String, { nullable: true })
  public email?: string;

  @Field(() => ID, { nullable: true })
  public schoolId?: number;
}
