import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateSpecialistCommentInput } from './createSpecialistcomment.input';

@InputType()
export class UpdateSpecialistCommentInput extends OmitType(
  PartialType(CreateSpecialistCommentInput),
  ['storyId'],
) {
  @Field(() => String)
  specialistCommentId: string;
}
