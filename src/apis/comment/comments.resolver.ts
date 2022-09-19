import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';
import { UpdateCommentInput } from './dto/updateComment.input';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService, //
  ) {}

  @Query(() => [Comment], { description: '사연에 달린 댓글들 조회' })
  async fetchCommentsWithStoryId(
    @Args('storyId') storyId: string, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return await this.commentsService.findAllWithStoryId({ storyId, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Comment], { description: '자신의 댓글 목록 조회' })
  async fetchOwnComments(
    @Context() context: any, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.findOwnComments({ userId, page });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [Comment], { description: '신고 댓글 전체 조회' })
  async fetchReportedComments(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return await this.commentsService.findReportedComments({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment, { description: '댓글 등록' })
  async createComment(
    @Context() context: any,
    @Args('createCommentInput') createCommentInput: CreateCommentInput, //
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.create({ userId, createCommentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment, { description: '댓글 수정' })
  async updateComment(
    @Context() context: any, //
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.update({ userId, updateCommentInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '자신 댓글 삭제' })
  deleteOwnComment(
    @Context() context: any, //
    @Args('id') id: string,
  ) {
    const userId = context.req.user.id;
    return this.commentsService.deleteOwn({ userId, id });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '신고 댓글 삭제' })
  deleteReportedComment(@Args('id') id: string) {
    return this.commentsService.deleteReported({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '댓글 신고' })
  reportComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentsService.report({ commentId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment, { description: '댓글 좋아요' })
  async likeComment(
    @Context() context: any, //
    @Args('commentId') commentId: string,
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.like({ userId, commentId });
  }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Comment, { description: '댓글 좋아요 취소' })
  // async deleteLikeComment(
  //   @Context() context: any, //
  //   @Args('commentId') commentId: string,
  // ) {
  //   const userId = context.req.user.id;
  //   return this.commentsService.undoLike({ userId, commentId });
  // }
}
