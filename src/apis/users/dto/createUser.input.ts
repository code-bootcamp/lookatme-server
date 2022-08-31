import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateAddressInput } from 'src/apis/addresses/dto/createAddress.input';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String)
  gender: string;

  @Min(0)
  @Field(() => Int)
  height: number;

  @Field(() => Boolean, { nullable: true })
  admin: boolean;

  @Field(() => [CreateAddressInput])
  addresses: CreateAddressInput[];
}
