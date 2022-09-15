import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { User } from '../user/entities/user.entity';
import { SpecialistReview } from './entities/specialistReview.entity';

@Injectable()
export class SpecialistReviewsService {
  constructor(
    @InjectRepository(SpecialistReview)
    private readonly specialistReviewsRepository: Repository<SpecialistReview>,
    @InjectRepository(Specialist)
    private readonly specialistsRepository: Repository<Specialist>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({ userId, createSpecialistReviewInput }) {
    const { text, rate, specialistId } = createSpecialistReviewInput;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const specialist = await this.specialistsRepository.findOne({
      where: { id: specialistId },
    });

    const result = await this.specialistReviewsRepository.save({
      text,
      rate,
      user,
      specialist,
    });

    // 전문가에게 달린 리뷰의 개수
    const reviews = await this.specialistReviewsRepository.find({
      where: { specialist },
    });
    const countReview = reviews.length;

    // 리뷰에 매겨진 점수의 총합
    let sumOfRate = 0;
    for (const el of reviews) {
      sumOfRate += el.rate;
    }

    // 평균 점수(총합 / 리뷰 개수)
    const averageRate = sumOfRate / countReview;

    // 구한 평균 점수 전문가 테이블에 저장
    await this.specialistsRepository.save({
      ...specialist,
      id: specialistId,
      averageRate,
    });

    return result;
  }
}
