import { InputType, Field } from 'type-graphql';

@InputType()
export class PasswordUpdateInput {
  @Field(() => String)
  public oldPassword: string;

  @Field(() => String)
  public newPassword: string;
}
