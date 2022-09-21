import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialistComment } from '../specialistComment/entities/specialistComment.entity';
import { Story } from '../story/entities/story.entity';
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

    @InjectRepository(Story)
    private readonly storiesRepository: Repository<Story>,
  ) {}

  async findAllUnderSpecialistCommentWithId({ specialistCommentId }) {
    return await this.underSpecialistCommentsRepository.find({
      where: { specialistComment: { id: specialistCommentId } },
      relations: ['user', 'specialistComment'],
    });
  }

  async create({ userId, createUnderSpecialistCommentInput }) {
    const { contents, specialistCommentId } = createUnderSpecialistCommentInput;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: specialistCommentId },
      relations: ['story'],
    });

    const result = await this.underSpecialistCommentsRepository.save({
      contents,
      specialistComment,
      user,
    });

    await this.storiesRepository.update(
      { id: specialistComment.story.id },
      { commentCounts: specialistComment.story.commentCounts + 1 },
    );

    return result;
  }

  async update({ userId, updateUnderSpecialistCommentInput }) {
    const { contents, underSpecialistCommentId } =
      updateUnderSpecialistCommentInput;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const underSpecialistComment =
      await this.underSpecialistCommentsRepository.findOne({
        where: { id: underSpecialistCommentId, user: { id: userId } },
        relations: ['specialistComment'],
      });

    const specialistCommentId = underSpecialistComment.specialistComment.id;

    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: specialistCommentId },
    });

    const result = await this.underSpecialistCommentsRepository.save({
      ...underSpecialistComment,
      id: underSpecialistCommentId,
      contents,
      user,
      specialistComment,
    });

    return result;
  }

  async delete({ userId, underSpecialistCommentId }) {
    const underSpecialistComment =
      await this.underSpecialistCommentsRepository.findOne({
        where: { id: underSpecialistCommentId },
        relations: ['specialistComment'],
      });

    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: underSpecialistComment.specialistComment.id },
      relations: ['story'],
    });

    const result = await this.underSpecialistCommentsRepository.delete({
      id: underSpecialistCommentId,
      user: { id: userId },
    });

    await this.storiesRepository.update(
      { id: specialistComment.story.id },
      { commentCounts: specialistComment.story.commentCounts - 1 },
    );

    return result.affected ? true : false;
  }
}
