import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCommentInput } from './createComment.input';
@InputType()
export class UpdateCommentInput extends OmitType(
  PartialType(CreateCommentInput),
  ['storyId'],
) {
  @Field(() => String)
  commentId: string;
}
