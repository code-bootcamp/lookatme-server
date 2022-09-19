import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
  GqlAuthSpecialistAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CreateSpecialistCommentInput } from './dto/createSpecialistcomment.input';
import { UpdateSpecialistCommentInput } from './dto/updateSpecialistcomment.input';
import { SpecialistComment } from './entities/specialistComment.entity';
import { SpecialistCommentsService } from './specialistComments.service';

/**
 *  Description : API docs for specialist's comment setting
 *  Constructor : SpecialistCommentsService
 *  Content :
 *    [ Query ]
 *      fetchSpecialistCommentsWithStoryId    [ storyId: String, page: Int => [SpecialistComment] ]
 *                                              : 사연에 달린 전문가 답변 조회 API
 *      fetchSpecialistOwnComments            [ context: any, page: Int => [SpecialistComment] ]
 *                                              : 전문가 자신의 답변들 조회 API
 *      fetchReportedSpecialistComments       [ page: Int => [SpecialistComment] ]
 *                                              : 신고된 전문가 답변 전체 조회 API
 *    [ Mutation ]
 *      createSpecialistComment               [ context: any, createSpecialistCommentInput: CreateSpecialistCommentInput => SpecialistComment ]
 *                                              : 전문가 답변 등록 API
 *      updateSpecialistOwnComment            [ context: any, updateSpecialistCommentInput: UpdateSpecialistCommentInput => SpecialistComment ]
 *                                              : 전문가 자신의 답변 수정 API
 *      deleteSpecialistOwnComment            [ specialistCommentId: String => Boolean ]
 *                                              : 전문가 자신의 답변 삭제 API
 *      deleteReportedSpecialistComment       [ specialistCommentId: String => Boolean ]
 *                                              : 신고된 전문가 답변 삭제 API
 *      reportSpecialistComment               [ specialistCommentId: String => Boolean ]
 *                                              : 전문가 답변 신고 API
 */

@Resolver()
export class SpecialistCommentsResolver {
  constructor(
    private readonly specialistCommentsService: SpecialistCommentsService, //
  ) {}

  @Query(() => [SpecialistComment], {
    description: '사연에 달린 전문가 답변들 조회',
  })
  async fetchSpecialistCommentsWithStoryId(
    @Args('storyId') storyId: string, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return await this.specialistCommentsService.findAllWithStoryId({
      storyId,
      page,
    });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Query(() => [SpecialistComment], {
    description: '전문가 자신의 답변들 조회',
  })
  async fetchSpecialistOwnComments(
    @Context() context: any, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    const specialistId = context.req.user.id;
    return this.specialistCommentsService.findAllOwnComments({
      specialistId,
      page,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [SpecialistComment], {
    description: '신고 전문가 답변 전체 조회',
  })
  async fetchReportedSpecialistComments(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return await this.specialistCommentsService.findReportedSpecialistComments({
      page,
    });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Mutation(() => SpecialistComment, { description: '전문가 답변 등록' })
  async createSpecialistComment(
    @Context() context: any, //
    @Args('createSpecialistCommentInput')
    createSpecialistCommentInput: CreateSpecialistCommentInput,
  ) {
    const specialistId = context.req.user.id;
    return await this.specialistCommentsService.create({
      specialistId,
      createSpecialistCommentInput,
    });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Mutation(() => SpecialistComment, { description: '전문가 자신의 답변 수정' })
  async updateSpecialistOwnComment(
    @Context() context: any, //
    @Args('updateSpecialistCommentInput')
    updateSpecialistCommentInput: UpdateSpecialistCommentInput,
  ) {
    const specialistId = context.req.user.id;
    return await this.specialistCommentsService.update({
      specialistId,
      updateSpecialistCommentInput,
    });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Mutation(() => Boolean, { description: '전문가 자신의 답변 삭제' })
  deleteSpecialistOwnComment(
    @Args('specialistCommentId') specialistCommentId: string, //
  ) {
    return this.specialistCommentsService.deleteSpecialistOwn({
      specialistCommentId,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '신고 전문가 답변 삭제' })
  deleteReportedSpecialistComment(@Args('specialistCommentId') id: string) {
    return this.specialistCommentsService.deleteReported({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '전문가 답변 신고' })
  reportSpecialistComment(
    @Args('specialistCommentId') specialistCommentId: string,
  ) {
    return this.specialistCommentsService.report({ specialistCommentId });
  }
}
