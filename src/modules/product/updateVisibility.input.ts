import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class UpdateVisibilityInput {
  @Field(() => ID)
  public productId: number;

  @Field(() => Boolean)
  public visible: boolean;
}
