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
  ) {
    return await this.specialistCommentsService.findAllWithStoryId({ storyId });
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
    @Context() context: any, //
    @Args('specialistCommentId') specialistCommentId: string,
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
