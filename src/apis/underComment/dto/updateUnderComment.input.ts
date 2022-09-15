import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUnderCommentInput } from './createUnderComment.input';

@InputType()
export class UpdateUnderCommentInput extends OmitType(
  PartialType(CreateUnderCommentInput),
  ['commentId'],
) {
  @Field(() => String)
  underCommentId: string;
}
