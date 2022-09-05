import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateSpecialistInput } from './createSpecialist.input';

@InputType()
export class UpdateSpecialistInput extends OmitType(
  PartialType(CreateSpecialistInput),
  ['account', 'password'],
) {}
