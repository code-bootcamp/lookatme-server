import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { StoryImage } from '../storyImages/entities/storyImage.entity';
import { User } from '../users/entities/user.entity';
import { Story } from './entities/story.entity';
import { StoryResolver } from './story.resolver';
import { StoryService } from './story.service';

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
