import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateStoryInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => [String], { nullable: true })
  imgUrl?: string[];

  @Field(() => String)
  categoryName: string;
}
