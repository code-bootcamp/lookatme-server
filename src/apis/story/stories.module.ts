import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { User } from '../user/entities/user.entity';
import { Story } from './entities/story.entity';
import { StoryResolver } from './stories.resolver';
import { StoryService } from './stories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story, //
      StoryImage,
      Category,
      User,
    ]),
  ],
  providers: [
    StoryResolver, //
    StoryService,
  ],
})
export class StroyModule {}
