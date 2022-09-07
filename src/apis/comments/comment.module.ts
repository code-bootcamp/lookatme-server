import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CommentsResolver } from './comment.resolver';
import { CommentsService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment, //
      User,
    ]),
  ],
  providers: [
    CommentsResolver, //
    CommentsService,
  ],
})
export class CommentsModule {}
