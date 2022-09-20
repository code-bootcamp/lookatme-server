import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { UnderComment } from './entity/underComment.entity';

@Injectable()
export class UnderCommentsService {
  constructor(
    @InjectRepository(UnderComment)
    private readonly underCommentsRepository: Repository<UnderComment>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAllWithCommentId({ commentId }) {
    return await this.underCommentsRepository.find({
      where: { comment: { id: commentId } },
      relations: ['user', 'comment'],
    });
  }

  async findAllReported() {
    const result = await this.underCommentsRepository.find({
      where: { isReported: true },
    });

    return result;
  }

  async create({ userId, createUnderCommentInput }) {
    const { contents, commentId } = createUnderCommentInput;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    const result = await this.underCommentsRepository.save({
      contents,
      user,
      comment,
    });

    return result;
  }

  async updateOwn({ userId, updateUnderCommentInput }) {
    const { contents, underCommentId } = updateUnderCommentInput;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const underCommentToUpdate = await this.underCommentsRepository.findOne({
      where: { id: underCommentId, user: { id: userId } },
      relations: ['comment'],
    });
    const commentId = underCommentToUpdate.comment.id;

    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    const result = await this.underCommentsRepository.save({
      ...underCommentToUpdate,
      id: underCommentId,
      contents,
      comment,
      user,
    });

    return result;
  }

  async deleteOwn({ userId, id }) {
    const result = await this.underCommentsRepository.delete({
      id,
      user: { id: userId },
    });

    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.underCommentsRepository.delete({
      id,
    });

    return result.affected ? true : false;
  }

  async report({ underCommentId }) {
    const underCommentToReport = await this.underCommentsRepository.findOne({
      where: { id: underCommentId },
    });

    const result = await this.underCommentsRepository.save({
      ...underCommentToReport,
      id: underCommentId,
      isReported: true,
    });

    return result.isReported ? true : false;
  }
}
