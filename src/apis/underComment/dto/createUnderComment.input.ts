import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUnderCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => String)
  commentId: string;
}
