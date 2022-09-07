import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CommentsService } from './comment.service';
import { CreateCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  async createComment(
    @Context() context: any,
    @Args('createCommentInput') createCommentInput: CreateCommentInput, //
  ) {
    const userId = context.req.user.id;
    return await this.commentsService.create({ userId, createCommentInput });
  }
}
