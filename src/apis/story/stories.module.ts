import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { UnderSpecialistComment } from '../underSpecialistComment/entities/underSpecialistComment.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
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
      Ticket,
      UnderSpecialistComment,
      Comment,
      UnderComment,
      StoryImage,
    ]),
  ],
  providers: [
    StoryResolver, //
    StoryService,
    CategoryService,
    UsersService,
  ],
})
export class StroyModule {}
