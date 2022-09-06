import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateStoryInput } from './dto/createStory.input';
import { Story } from './entities/story.entity';
import { StoryService } from './story.service';

@Resolver()
export class StoryResolver {
  constructor(
    private readonly storyService: StoryService, //
  ) {}

  @Mutation(() => Story)
  async createStory(
    @Args('createStoryInput') createStoryInput: CreateStoryInput, //
  ) {
    return await this.storyService.create({ createStoryInput });
  }
}
