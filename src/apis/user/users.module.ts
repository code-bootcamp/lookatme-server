import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { Story } from '../story/entities/story.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { UnderSpecialistComment } from '../underSpecialistComment/entities/underSpecialistComment.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Story,
      Ticket,
      UnderSpecialistComment,
      Comment,
      UnderComment,
      StoryImage,
    ]),
  ],
  providers: [
    UsersResolver, //
    UsersService,
  ],
})
export class UsersModule {}
