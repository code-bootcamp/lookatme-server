import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { UnderComment } from './entity/underComment.entity';
import { UnderCommentsResolver } from './underComment.resolver';
import { UnderCommentsService } from './underComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnderComment, //
      User,
      Comment,
    ]),
  ],
  providers: [
    UnderCommentsResolver, //
    UnderCommentsService,
  ],
})
export class UnderCommentsModule {}
