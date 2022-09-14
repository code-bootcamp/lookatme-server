import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSpecialistInput {
  @Field(() => String)
  account: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  summary: string;

  @Field(() => String)
  imgUrl: string;

  @Field(() => String)
  introduction: string;

  @Field(() => String)
  career: string;

  @Field(() => Int)
  price: number;
}
