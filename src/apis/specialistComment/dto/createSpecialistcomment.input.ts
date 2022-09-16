import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpecialistCommentInput {
  @Field(() => String)
  text: string;

  @Field(() => String)
  storyId: string;
}
