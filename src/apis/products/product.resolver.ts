import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(
    private readonly productService: ProductService, //
  ) {}

  @Query(() => [Product])
  fetchProducts() {
    return this.productService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Product)
  createProduct(
    @Context() context: any, //
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    const userId = context.req.user.id;
    return this.productService.create({ createProductInput, userId });
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update({ id, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('id') id: string, //
  ) {
    return this.productService.delete({ id });
  }
}
