import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpecialistReviewInput {
  @Field(() => String)
  text: string;

  @Field(() => Float)
  rate: number;

  @Field(() => String)
  specialistId: string;
}
