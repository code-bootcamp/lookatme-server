import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { timeStamp } from 'console';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CreateStoryInput } from './dto/createStory.input';
import { UpdateStoryInput } from './dto/updateStory.input';
import { Story } from './entities/story.entity';
import { StoryService } from './stories.service';

@Resolver()
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService, //
  ) {}

  @Query(() => [Story], { description: '사연 전체 목록 조회' })
  async fetchStories() {
    return this.storyService.findAll();
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
}
