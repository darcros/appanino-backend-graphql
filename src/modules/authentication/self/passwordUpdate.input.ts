import { InputType, Field } from 'type-graphql';
import { MinLength } from 'class-validator';

@InputType()
export class PasswordUpdateInput {
  @Field(() => String)
  @MinLength(8)
  public oldPassword: string;

  @Field(() => String)
  @MinLength(8)
  public newPassword: string;
}
