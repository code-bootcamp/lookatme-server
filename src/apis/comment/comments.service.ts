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

  async findAllWithStoryId({ storyId, page }) {
    const result = await this.commentsRepository.find({
      where: { story: { id: storyId } },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
      relations: ['user', 'underComments'],
    });

    return result;
  }

  async findOwnComments({ userId, page }) {
    return await this.commentsRepository.find({
      where: { user: { id: userId } },
      relations: ['story'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findReportedComments({ page }) {
    return await this.commentsRepository.find({
      where: { isReported: true },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({ userId, createCommentInput }) {
    const { text, storyId } = createCommentInput;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
    });

    const result = await this.commentsRepository.save({
      text,
      story,
      user,
    });

    await this.storiesRepository.update(
      { id: storyId },
      { commentCounts: story.commentCounts + 1 },
    );

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
      user,
    });

    return result;
  }

  async deleteOwn({ userId, commentId }) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['story', 'underComments'],
    });

    const underCommentCount = comment.underComments.length;

    const result = await this.commentsRepository.delete({
      id: commentId,
      user,
    });

    await this.storiesRepository.update(
      { id: comment.story.id },
      { commentCounts: comment.story.commentCounts - (1 + underCommentCount) },
    );

    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const comment = await this.commentsRepository.findOne({
      where: { id: id },
      relations: ['story', 'underComments'],
    });

    const underCommentCount = comment.underComments.length;

    const result = await this.commentsRepository.delete({ id });

    await this.storiesRepository.update(
      { id: comment.story.id },
      { commentCounts: comment.story.commentCounts - (1 + underCommentCount) },
    );

    return result.affected ? true : false;
  }

  async report({ commentId }) {
    const commentToReport = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    const result = await this.commentsRepository.save({
      ...commentToReport,
      id: commentId,
      isReported: true,
    });

    return result.isReported ? true : false;
  }

  async like({ userId, commentId }) {
    const commentToLike = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['likedUsers'],
    });

    const likedUsers = commentToLike.likedUsers;

    if (likedUsers.some((el) => el.id === userId)) {
      const likeUser = likedUsers.find((el) => el.id === userId);
      const idx = likedUsers.indexOf(likeUser);
      likedUsers.splice(idx, 1);
    } else {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      likedUsers.push(user);
    }

    const result = await this.commentsRepository.save({
      ...commentToLike,
      id: commentId,
      likedUsers,
      likes: likedUsers.length,
    });

    return result;
  }
}
