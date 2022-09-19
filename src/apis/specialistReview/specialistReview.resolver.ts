import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateSpecialistReviewInput } from './dto/createSpecialistReview.input';
import { SpecialistReview } from './entities/specialistReview.entity';
import { SpecialistReviewsService } from './specialistReview.service';

/**
 *  Description : API docs for specialist's review setting
 *  Constructor : SpecialistReviewsService
 *  Content :
 *    [ Query ]
 *      fetchSpecialistReviewsWithSpecialistId
 *          [ specialistId: String, page: Int => [SpecialistReview] ]
 *            : 전문가에 달린 리뷰 전체 조회 API
 *    [ Mutation ]
 *      createSpecialistReview
 *          [ context: any, createSpecialistReviewInput: CreateSpecialistReviewInput => SpecialistReview ]
 *            : 전문가 후기 등록 API
 */

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
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return await this.specialistReviewsServise.findAllWithSpecialistId({
      specialistId,
      page,
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
