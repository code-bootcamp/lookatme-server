import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialistComment } from '../specialistComment/entities/specialistComment.entity';
import { User } from '../user/entities/user.entity';
import { UnderSpecialistComment } from './entities/underSpecialistComment.entity';

@Injectable()
export class UnderSpecialistCommentsService {
  constructor(
    @InjectRepository(UnderSpecialistComment)
    private readonly underSpecialistCommentsRepository: Repository<UnderSpecialistComment>,
    @InjectRepository(SpecialistComment)
    private readonly specialistCommentsRepository: Repository<SpecialistComment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUnderSpecialistCommentWithId({ specialistCommentId }) {
    return await this.underSpecialistCommentsRepository.find({
      where: { specialistComment: { id: specialistCommentId } },
    });
  }

  async create({ userId, createUnderSpecialistCommentInput }) {
    const { contents, specialistCommentId } = createUnderSpecialistCommentInput;

    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: specialistCommentId },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const result = await this.underSpecialistCommentsRepository.save({
      contents,
      specialistComment,
      user,
    });

    return result;
  }
}
