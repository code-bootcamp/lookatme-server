import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
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

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [SpecialistComment], {
    description: '신고 전문가 답변 전체 조회',
  })
  async fetchReportedSpecialistComments() {
    return await this.specialistCommentsService.findReportedSpecialistComments();
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
}
