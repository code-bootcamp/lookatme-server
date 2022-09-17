import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUnderSpecialistCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => String)
  specialistCommentId: string;
}
