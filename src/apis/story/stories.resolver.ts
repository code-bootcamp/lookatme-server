import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { CATEGORY_NAME } from 'src/commons/type/enum';
import { CreateStoryInput } from './dto/createStory.input';
import { UpdateStoryInput } from './dto/updateStory.input';
import { Story } from './entities/story.entity';
import { StoryService } from './stories.service';

/**
 *  Description : API docs for story setting
 *  Constructor : StoryService
 *  Content :
 *    [ Query ]
 *      fetchStory              [ storyId: String => Story ]
 *                                : ID로 사연 조회 API
 *      fetchBestStories        [ None => [Story] ]
 *                                : 베스트 사연 5개 조회 API
 *      fetchStoriesByTime      [ page: Int, categoryName?: String => [Story] ]
 *                                : 시간순으로 사연 조회 API
 *      fetchStoriesByLike      [ page: Int, categoryName?: String => [Story] ]
 *                                : 좋아요순으로 사연 조회 API
 *      fetchStoriesByComment   [ page: Int, categoryName?: String => [Story] ]
 *                                :  댓글 개수순으로 사연 조회 API
 *      fetchReportedStories    [ page: Int => [Story] ]
 *                                : 신고된 사연 전체 조회 API
 *      fetchOwnStories         [ context: IContext, page: Int => [Story] ]
 *                                : 회원의 사연 조회 API
 *    [ Mutation ]
 *      createStory             [ context: any, createStoryInput: CreateStoryInput => Story ]
 *                                : 사연 등록 API
 *      updateStory             [ context: any, updateStoryId: String, updateStoryInput: UpdateStoryInput => Story ]
 *                                : 사연 수정 API
 *      deleteOwnStory          [ context: any, id: String => Boolean ]
 *                                : 자신이 등록한 사연 삭제 API
 *      deleteReportedStory     [ id: String => Boolean ]
 *                                : 신고된 사연 삭제 API
 *      likeStory               [ storyId: String, context: IContext => Story ]
 *                                : 사연 좋아요 / 좋아요 취소 API
 *      reportStory             [ storyId: String => Boolean ]
 *                                : 사연 신고 API
 */

@Resolver()
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService, //
  ) {}

  @Query(() => Story, { description: 'ID로 사연 조회' })
  async fetchStory(
    @Args('storyId') storyId: string, //
  ) {
    return await this.storyService.find({ storyId });
  }

  @Query(() => [Story], { description: '베스트 사연 5개 조회' })
  async fetchBestStories() {
    return await this.storyService.findBestStories();
  }

  @Query(() => [Story], { description: '시간순으로 사연 조회' })
  async fetchStoriesByTime(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'categoryName', nullable: true })
    categoryName?: CATEGORY_NAME, //
  ) {
    return await this.storyService.findAllByTime({ categoryName, page });
  }

  @Query(() => [Story], { description: '좋아요순으로 사연 조회' })
  async fetchStoriesByLike(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'categoryName', nullable: true })
    categoryName?: CATEGORY_NAME, //
  ) {
    return await this.storyService.findAllByLike({ categoryName, page });
  }

  @Query(() => [Story], { description: '댓글 개수순으로 사연 조회' })
  async fetchStoriesByComment(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'categoryName', nullable: true })
    categoryName?: CATEGORY_NAME, //
  ) {
    return await this.storyService.findAllByComment({ categoryName, page });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [Story], { description: '신고 사연 전체 조회' })
  async fetchReportedStories(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.storyService.findReportedStories({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Story], { description: '회원의 사연 조회' })
  fetchOwnStories(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.storyService.findOwnStories({
      userId: context.req.user.id,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Story, { description: '사연 등록' })
  async createStory(
    @Context() context: any, //
    @Args('createStoryInput') createStoryInput: CreateStoryInput,
  ) {
    const userId = context.req.user.id;
    return await this.storyService.create({ createStoryInput, userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Story, { description: '사연 수정' })
  async updateStory(
    @Context() context: any,
    @Args('updateStoryId') id: string, //
    @Args('updateStoryInput') updateStoryInput: UpdateStoryInput,
  ) {
    const userId = context.req.user.id;
    return await this.storyService.update({ id, userId, updateStoryInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '자신이 등록한 사연 삭제' })
  deleteOwnStory(
    @Context() context: any, //
    @Args('id') id: string,
  ) {
    const userId = context.req.user.id;
    return this.storyService.deleteOwn({ id, userId });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '신고 사연 삭제' })
  deleteReportedStory(
    @Args('id') id: string, //
  ) {
    return this.storyService.deleteReported({ id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Story, { description: '사연 좋아요 / 좋아요 취소 API' })
  likeStory(
    @Args('storyId') storyId: string, //
    @Context() context: IContext,
  ) {
    return this.storyService.userLikeStory({
      userId: context.req.user.id,
      storyId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '사연 신고' })
  reportStory(
    @Args('storyId') storyId: string, //
  ) {
    return this.storyService.report({ storyId });
  }
}
