import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './createProduct.input';

@InputType()
export class updateProductInput extends PartialType(CreateProductInput) {}
