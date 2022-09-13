import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Story } from '../story/entities/story.entity';
import { SpecialistComment } from './entities/specialistComment.entity';

@Injectable()
export class SpecialistCommentsService {
  constructor(
    @InjectRepository(SpecialistComment)
    private readonly specialistCommentsRepository: Repository<SpecialistComment>,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  async findReportedSpecialistComments() {
    return this.specialistCommentsRepository.find({
      where: { isReported: true },
    });
  }

  async create({ specialistId, createSpecialistCommentInput }) {
    const { title, text, storyId } = createSpecialistCommentInput;
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
    });

    const result = await this.specialistCommentsRepository.save({
      title,
      text,
      specialist,
      story,
    });

    return result;
  }

  async update({ specialistId, updateSpecialistCommentInput }) {
    const { specialistCommentId, ...rest } = updateSpecialistCommentInput;

    const specialistCommentToUpdate =
      await this.specialistCommentsRepository.findOne({
        where: {
          id: specialistCommentId,
          specialist: { id: specialistId },
        },
      });

    const result = await this.specialistCommentsRepository.save({
      ...specialistCommentToUpdate,
      id: specialistCommentId,
      ...rest,
    });

    return result;
  }

  async deleteSpecialistOwn({ specialistCommentId }) {
    const result = await this.specialistCommentsRepository.softDelete({
      id: specialistCommentId,
    });
    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.specialistCommentsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
