import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class UserRegistrationInput {
  @Field(() => String)
  public firstname: string;

  @Field(() => String)
  public lastname: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => ID)
  public schoolId: number;
}
