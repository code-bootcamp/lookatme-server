import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateProductInput } from 'src/apis/products/dto/createProduct.input';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  contents: string;

  @Field(() => String)
  season: string;

  @Field(() => Boolean)
  isMaker: boolean;

  @Field(() => [CreateProductInput])
  products: CreateProductInput[];
}
