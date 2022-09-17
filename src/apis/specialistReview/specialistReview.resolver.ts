import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CreateSpecialistReviewInput } from './dto/createSpecialistReview.input';
import { SpecialistReview } from './entities/specialistReview.entity';
import { SpecialistReviewsService } from './specialistReview.service';

@Resolver()
export class SpecialistReviewsResovler {
  constructor(
    private readonly specialistReviewsServise: SpecialistReviewsService, //
  ) {}

  @Query(() => [SpecialistReview], {
    description: '전문가에게 달린 리뷰들 조회',
  })
  async fetchSpecialistReviewsWithSpecialistId(
    @Args('specialistId') specialistId: string, //
  ) {
    return await this.specialistReviewsServise.findAllWithSpecialistId({
      specialistId,
    });
  }

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
