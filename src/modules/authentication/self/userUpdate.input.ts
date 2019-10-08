import { InputType, Field, ID } from 'type-graphql';
import { MinLength } from 'class-validator';

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  @MinLength(1)
  public firstname?: string;

  @Field(() => String, { nullable: true })
  @MinLength(1)
  public lastname?: string;

  @Field(() => ID, { nullable: true })
  public schoolId?: number;
}
