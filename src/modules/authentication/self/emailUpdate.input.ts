import { InputType, Field } from 'type-graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class EmailUpdateInput {
  @Field(() => String)
  @IsEmail()
  public newEmail: string;
}
