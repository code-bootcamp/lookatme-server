import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../story/entities/story.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Story)
    private readonly storiesRepository: Repository<Story>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.commentsRepository.find();
  }

  async create({ userId, createCommentInput }) {
    const { text, storyId } = createCommentInput;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
    });

    const result = this.commentsRepository.save({
      text,
      story,
      user,
    });
    return result;
  }

  async update({ userId, updateCommentInput }) {
    const { text, commentId } = updateCommentInput;
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const commentToUpdate = await this.commentsRepository.findOne({
      where: { id: commentId, user },
    });

    const result = await this.commentsRepository.save({
      ...commentToUpdate,
      id: commentId,
      text,
    });

    return result;
  }

  async deleteOwn({ userId, id }) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const result = await this.commentsRepository.softDelete({ id, user });

    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.commentsRepository.softDelete({ id });

    return result.affected ? true : false;
  }
}
