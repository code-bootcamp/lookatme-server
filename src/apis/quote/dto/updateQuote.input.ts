import { InputType, PartialType } from '@nestjs/graphql';
import { CreateQuoteInput } from './createQuote.input';

@InputType()
export class UpdateQuoteInput extends PartialType(CreateQuoteInput) {}
