import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Story } from '../story/entities/story.entity';
import { SpecialistComment } from './entities/specialistComment.entity';
import { SpecialistCommentsResolver } from './specialistComments.resolver';
import { SpecialistCommentsService } from './specialistComments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Specialist, //
      SpecialistComment,
      Story,
    ]),
  ],
  providers: [
    SpecialistCommentsResolver, //
    SpecialistCommentsService,
  ],
})
export class SpcialistCommentsModule {}
