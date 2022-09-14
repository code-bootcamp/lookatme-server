import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Comment], { description: '자신의 댓글 목록 조회' })
  async fetchOwnComments(
    @Context() context: any, //
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.findOwnComments({ userId });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [Comment], { description: '신고 댓글 전체 조회' })
  async fetchReportedComments() {
    return await this.commentsService.findReportedComments();
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
}
