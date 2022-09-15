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

  @Query(() => [UnderComment])
  async fetchUnderCommentsWithCommentId(@Args('commentId') commentId: string) {
    return await this.underCommentsService.findAllWithCommentId({ commentId });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [UnderComment])
  async fetchReportedUnderComments() {
    return this.underCommentsService.findAllReported();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => UnderComment)
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
  @Mutation(() => UnderComment)
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
  @Mutation(() => Boolean)
  deleteOwnUnderComment(
    @Context() context: any, //
    @Args('underCommentId') id: string,
  ) {
    const userId = context.req.user.id;
    return this.underCommentsService.deleteOwn({ userId, id });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean)
  deleteReportedUnderComment(@Args('underCommentId') id: string) {
    return this.underCommentsService.deleteReported({ id });
  }
}
