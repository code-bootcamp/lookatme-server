import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUnderSpecialistCommentInput } from './createUnderSpecialistComment.input';

@InputType()
export class UpdateUnderSpecialistCommentInput extends OmitType(
  PartialType(CreateUnderSpecialistCommentInput),
  ['specialistCommentId'],
) {
  @Field(() => String)
  underSpecialistCommentId: string;
}
