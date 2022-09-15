import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CreateUnderCommentInput } from './dto/createUnderComment.input';
import { UpdateUnderCommentInput } from './dto/updateUnderComment.input';
import { UnderComment } from './entity/underComment.entity';
import { UnderCommentsService } from './underComment.service';

@Resolver()
export class UnderCommentsResolver {
  constructor(
    private readonly underCommentsService: UnderCommentsService, //
  ) {}

  @Query(() => [UnderComment], { description: '댓글에 달린 대댓글 조회' })
  async fetchUnderCommentsWithCommentId(
    @Args('commentId') commentId: string, //
  ) {
    return await this.underCommentsService.findAllWithCommentId({ commentId });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [UnderComment], { description: '신고 대댓글 조회' })
  async fetchReportedUnderComments() {
    return this.underCommentsService.findAllReported();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => UnderComment, { description: '대댓글 등록' })
  async createUnderComment(
    @Context() context: any, //
    @Args('createUnderCommentInput')
    createUnderCommentInput: CreateUnderCommentInput,
  ) {
    const userId = context.req.user.id;
    return await this.underCommentsService.create({
      userId,
      createUnderCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => UnderComment, { description: '자신의 대댓글 수정' })
  async updateOwnUnderComment(
    @Context() context: any, //
    @Args('updateUnderCommentInput')
    updateUnderCommentInput: UpdateUnderCommentInput,
  ) {
    const userId = context.req.user.id;
    return await this.underCommentsService.updateOwn({
      userId,
      updateUnderCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '자신의 대댓글 삭제' })
  deleteOwnUnderComment(
    @Context() context: any, //
    @Args('underCommentId') id: string,
  ) {
    const userId = context.req.user.id;
    return this.underCommentsService.deleteOwn({ userId, id });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '신고 대댓글 삭제' })
  deleteReportedUnderComment(@Args('underCommentId') id: string) {
    return this.underCommentsService.deleteReported({ id });
  }
}
