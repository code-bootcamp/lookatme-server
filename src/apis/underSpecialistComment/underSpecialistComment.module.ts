import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistComment } from '../specialistComment/entities/specialistComment.entity';
import { Story } from '../story/entities/story.entity';
import { User } from '../user/entities/user.entity';
import { UnderSpecialistComment } from './entities/underSpecialistComment.entity';
import { UnderSpecialistCommentsResolver } from './underSpecialistComment.resolver';
import { UnderSpecialistCommentsService } from './underSpecialistComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnderSpecialistComment, //
      SpecialistComment,
      User,
      Story,
    ]),
  ],
  providers: [
    UnderSpecialistCommentsResolver, //
    UnderSpecialistCommentsService,
  ],
})
export class UnderSpecialistCommentsModule {}
