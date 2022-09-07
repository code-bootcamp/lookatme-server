import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateStoryInput {
  @Field(() => String)
  text: string;

  @Field(() => [String], { nullable: true })
  imgUrl?: string[];

  @Field(() => Int)
  categoryNumber: number;
}
