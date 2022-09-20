import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../story/entities/story.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment, //
      User,
      Story,
      UnderComment,
    ]),
  ],
  providers: [
    CommentsResolver, //
    CommentsService,
    UsersService,
  ],
})
export class CommentsModule {}
