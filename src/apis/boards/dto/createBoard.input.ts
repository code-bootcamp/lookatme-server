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

  @Field(() => [String])
  url: string[];

  @Field(() => [String])
  tags: string[];

  @Field(() => [String])
  moodId: string[];

  @Field(() => [CreateProductInput])
  products: CreateProductInput[];
}
