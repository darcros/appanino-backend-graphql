import { InputType, Field, ID } from 'type-graphql';
import { MinLength, IsEmail } from 'class-validator';

@InputType()
export class UserRegistrationInput {
  @Field(() => String)
  @MinLength(1)
  public firstname: string;

  @Field(() => String)
  @MinLength(1)
  public lastname: string;

  @Field(() => String)
  @IsEmail()
  public email: string;

  @Field(() => String)
  @MinLength(8)
  public password: string;

  @Field(() => ID)
  public schoolId: number;
}
