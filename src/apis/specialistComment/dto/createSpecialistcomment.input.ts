import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpecialistcommentInput {
  //   @Field
  title: string;

  text: string;
}
