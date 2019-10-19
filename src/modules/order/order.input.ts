import { InputType, Field, Int, ID } from 'type-graphql';

@InputType()
class OrderItemInput {
  @Field(() => ID)
  public productId: number;

  @Field(() => Int)
  public quantity: number;
}

@InputType()
export class OrderInput {
  @Field(() => [OrderItemInput])
  public items: OrderItemInput[];
}
