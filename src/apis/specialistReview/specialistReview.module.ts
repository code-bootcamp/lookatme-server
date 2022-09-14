import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { User } from '../user/entities/user.entity';
import { SpecialistReview } from './entities/specialistReview.entity';
import { SpecialistReviewsResovler } from './specialistReview.resolver';
import { SpecialistReviewsService } from './specialistReview.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecialistReview, //
      Specialist,
      User,
    ]),
  ],
  providers: [
    SpecialistReviewsResovler, //
    SpecialistReviewsService,
  ],
})
export class SpecialistReviewsModule {}
