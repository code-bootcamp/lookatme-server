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

  async findAllWithSpecialistId({ specialistId }) {
    return await this.specialistReviewsRepository.find({
      where: { specialist: { id: specialistId } },
    });
  }

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

    const reviews = await this.specialistReviewsRepository.find({
      where: { specialist },
    });
    const countReview = reviews.length;

    let sumOfRate = 0;
    for (const el of reviews) {
      sumOfRate += el.rate;
    }

    const averageRate = sumOfRate / countReview;

    await this.specialistsRepository.save({
      ...specialist,
      id: specialistId,
      averageRate,
    });

    return result;
  }
}
