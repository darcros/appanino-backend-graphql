import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class NewProductInput {
  @Field(() => String)
  public name: string;

  @Field(() => Number)
  public price: number;

  @Field(() => [ID])
  public schoolIds: number[];

  @Field(() => ID)
  public categoryId: number;
}
