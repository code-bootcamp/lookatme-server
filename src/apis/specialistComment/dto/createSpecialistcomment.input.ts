import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpecialistCommentInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  storyId: string;
}
