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

  async findAllWithStoryId({ storyId, page }) {
    const result = await this.specialistCommentsRepository.find({
      where: { story: { id: storyId } },
      relations: ['underSpecialistComments', 'specialist'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async findAllOwnComments({ specialistId, page }) {
    const result = await this.specialistCommentsRepository.find({
      where: { specialist: { id: specialistId } },
      relations: ['story'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async findReportedSpecialistComments({ page }) {
    return this.specialistCommentsRepository.find({
      where: { isReported: true },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({ specialistId, createSpecialistCommentInput }) {
    const { text, storyId } = createSpecialistCommentInput;

    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    const story = await this.storyRepository.findOne({
      where: { id: storyId },
    });

    const result = await this.specialistCommentsRepository.save({
      text,
      specialist,
      story,
    });

    await this.storyRepository.update(
      { id: storyId },
      { commentCounts: story.commentCounts + 1 },
    );

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

  async deleteSpecialistOwn({ specialistCommentId, specialistId }) {
    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: specialistCommentId },
      relations: ['story', 'underSpecialistComments'],
    });

    const underSpecialistCommentCount =
      specialistComment.underSpecialistComments.length;

    const result = await this.specialistCommentsRepository.delete({
      id: specialistCommentId,
      specialist: { id: specialistId },
    });

    await this.storyRepository.update(
      { id: specialistComment.story.id },
      {
        commentCounts:
          specialistComment.story.commentCounts -
          (1 + underSpecialistCommentCount),
      },
    );

    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const specialistComment = await this.specialistCommentsRepository.findOne({
      where: { id: id },
      relations: ['story', 'underSpecialistComments'],
    });

    const underSpecialistCommentCount =
      specialistComment.underSpecialistComments.length;

    const result = await this.specialistCommentsRepository.delete({
      id: id,
    });

    await this.storyRepository.update(
      { id: specialistComment.story.id },
      {
        commentCounts:
          specialistComment.story.commentCounts -
          (1 + underSpecialistCommentCount),
      },
    );

    return result.affected ? true : false;
  }

  async report({ specialistCommentId }) {
    const specialistCommentToReport =
      await this.specialistCommentsRepository.findOne({
        where: { id: specialistCommentId },
      });

    const result = await this.specialistCommentsRepository.save({
      ...specialistCommentToReport,
      id: specialistCommentId,
      isReported: true,
    });

    return result.isReported ? true : false;
  }
}
