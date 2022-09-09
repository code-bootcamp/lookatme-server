import { InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

@InputType()
export class UpdateUserWithAdminAccessInput extends OmitType(
  PartialType(CreateUserInput),
  ['password'],
) {}

@InputType()
export class UpdateUserInput extends PickType(PartialType(CreateUserInput), [
  'nickname',
  'email',
]) {}
