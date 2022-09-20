import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UpdateSpecialistCommentInput } from '../specialistComment/dto/updateSpecialistcomment.input';
import { CreateUnderSpecialistCommentInput } from './dto/createUnderSpecialistComment.input';
import { UpdateUnderSpecialistCommentInput } from './dto/updateUnderSpecialistComment.input';
import { UnderSpecialistComment } from './entities/underSpecialistComment.entity';
import { UnderSpecialistCommentsService } from './underSpecialistComment.service';

/**
 *  Description : API docs for specailist's under comment setting
 *  Constructor : UnderSpecialistCommentsService
 *  Content :
 *    [ Query ]
 *      fetchUnderSpecialistCommentWithId
 *            [ specialistCommentId: String => [UnderSpecialistComment] ]
 *              : 전문가 답변에 달린 대댓글 조회 API
 *    [ Mutation ]
 *      createUnderSpecialistComment
 *            [ context: any, createUnderSpecialistCommentInput: CreateUnderSpecialistCommentInput => UnderSpecialistComment ]
 *              : 전문가 답변 대댓글 등록
 */

@Resolver()
export class UnderSpecialistCommentsResolver {
  constructor(
    private readonly underSpecialistCommentsService: UnderSpecialistCommentsService,
  ) {}

  @Query(() => [UnderSpecialistComment], {
    description: '전문가 답변에 달린 대댓글들 조회',
  })
  async fetchUnderSpecialistCommentWithId(
    @Args('specialistCommentId') specialistCommentId: string,
  ) {
    return await this.underSpecialistCommentsService.findAllUnderSpecialistCommentWithId(
      { specialistCommentId },
    );
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => UnderSpecialistComment, {
    description: '전문가 답변 대댓글 등록',
  })
  async createUnderSpecialistComment(
    @Context() context: any, //
    @Args('createUnderSpecialistCommentInput')
    createUnderSpecialistCommentInput: CreateUnderSpecialistCommentInput, //
  ) {
    const userId = context.req.user.id;
    return this.underSpecialistCommentsService.create({
      userId,
      createUnderSpecialistCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => UnderSpecialistComment, {
    description: '전문가 답변 댓글 수정',
  })
  async updateUnderSpecialistComment(
    @Context() context: any, //
    @Args('updateSpecialistCommentInput')
    updateUnderSpecialistCommentInput: UpdateUnderSpecialistCommentInput,
  ) {
    const userId = context.req.user.id;
    return await this.underSpecialistCommentsService.update({
      userId,
      updateUnderSpecialistCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '전문가 답변 댓글 삭제' })
  deleteUnderSpecialistComment(
    @Context() context: any, //
    @Args('underSpecialistCommentId') underSpecialistCommentId: string,
  ) {
    const userId = context.req.user.id;
    return this.underSpecialistCommentsService.delete({
      userId,
      underSpecialistCommentId,
    });
  }
}
