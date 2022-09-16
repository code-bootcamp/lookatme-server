import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../story/entities/story.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
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
    private readonly usersService: UsersService,
  ) {}

  async findAllWithStoryId({ storyId }) {
    const result = await this.commentsRepository.find({
      where: { story: { id: storyId } },
    });

    return result;
  }

  async findOwnComments({ userId }) {
    return await this.commentsRepository.find({ where: { id: userId } });
  }

  async findReportedComments() {
    return await this.commentsRepository.find({ where: { isReported: true } });
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

    console.log('1 : ', commentToLike);

    const likedUsers = commentToLike.likedUsers;

    if (likedUsers.some((el) => el.id === userId)) {
      throw new ConflictException('이미 좋아요를 누른 댓글입니다.');
    }

    // const user = await this.usersRepository.findOne({ where: { id: userId } });
    const user = await this.usersService.findOneWithId({ userId });

    likedUsers.push(user);
    console.log(user, '======================');
    console.log('2 : ', likedUsers);
    console.log(likedUsers.length);

    const result = await this.commentsRepository.save({
      ...commentToLike,
      id: commentId,
      likedUsers,
      likes: likedUsers.length,
    });
    console.log('------------------------------');

    return result;
  }

  async undoLike({ userId, commentId }) {
    const commentToUndoLike = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['likedUsers'],
    });

    if (commentToUndoLike.likedUsers.every((el) => el.id !== userId)) {
      throw new ConflictException('좋아요를 누르지 않은 사연입니다.');
    }

    const likedUsers = commentToUndoLike.likedUsers.filter(
      (el) => el.id !== userId,
    );

    const result = this.commentsRepository.save({
      ...commentToUndoLike,
      id: commentId,
      likedUsers,
      likes: likedUsers.length,
    });

    return result;
  }
}
