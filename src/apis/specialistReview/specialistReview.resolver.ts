import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateSpecialistReviewInput } from './dto/createSpecialistReview.input';
import { SpecialistReview } from './entities/specialistReview.entity';
import { SpecialistReviewsService } from './specialistReview.service';

@Resolver()
export class SpecialistReviewsResovler {
  constructor(
    private readonly specialistReviewsServise: SpecialistReviewsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => SpecialistReview, { description: '전문가 후기 등록' })
  async createSpecialistReview(
    @Context() context: any, //
    @Args('createSpecialistReviewInput')
    createSpecialistReviewInput: CreateSpecialistReviewInput,
  ) {
    const userId = context.req.user.id;
    return await this.specialistReviewsServise.create({
      userId,
      createSpecialistReviewInput,
    });
  }
}
