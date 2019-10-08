import { InputType, Field, ID } from 'type-graphql';
import { MinLength, Min } from 'class-validator';
import { MaxDecimals } from '../../validation/MaxPrecision';

@InputType()
export class NewProductInput {
  @Field(() => String)
  @MinLength(1)
  public name: string;

  @Field(() => Number)
  @Min(0.01)
  @MaxDecimals(2)
  public price: number;

  @Field(() => [ID])
  public schoolIds: number[];

  @Field(() => ID)
  public categoryId: number;
}
