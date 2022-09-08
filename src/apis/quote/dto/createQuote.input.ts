import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuoteInput {
  @Field(() => String)
  author: string;

  @Field(() => String)
  message: string;
}
