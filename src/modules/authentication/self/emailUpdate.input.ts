import { InputType, Field } from 'type-graphql';

@InputType()
export class EmailUpdateInput {
  @Field(() => String)
  public newEmail: string;
}
