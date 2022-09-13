import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entities/category.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>, //
    @InjectRepository(StoryImage)
    private readonly storyImageRepository: Repository<StoryImage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
    private readonly usersService: UsersService,
  ) {}

  async findAll({ page }) {
    return await this.storyRepository.find({
      relations: ['user', 'category'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBestStories() {
    const stories = await this.storyRepository.find({
      relations: ['user'],
      order: { likes: 'DESC' },
    });

    return stories.slice(0, 5);
  }

  async findAllByTime({ categoryName, page }) {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    return await this.storyRepository.find({
      where: { category: category },
      relations: ['user', 'category'],
      order: { createAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAllByLike({ categoryName, page }) {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    return await this.storyRepository.find({
      where: { category: category },
      relations: ['user', 'category'],
      order: { likes: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAllByComment({ categoryName, page }) {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    return await this.storyRepository.find({
      where: { category: category },
      relations: ['user', 'category'],
      order: { commentCounts: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findReportedStories() {
    return await this.storyRepository.find({ where: { isReported: true } });
  }

  async create({ createStoryInput, userId }) {
    const { title, text, imgUrl, categoryName } = createStoryInput;
    const category = { id: '', name: '' };
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const foundCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (foundCategory === null) {
      const createdCategory = await this.categoryService.create({
        categoryName,
      });
      category.id = createdCategory.id;
      category.name = createdCategory.name;
    } else {
      category.id = foundCategory.id;
      category.name = foundCategory.name;
    }

    const result = await this.storyRepository.save({
      title,
      text,
      category,
      user,
    });

    if (imgUrl !== undefined) {
      await Promise.all(
        imgUrl.map((el) =>
          this.storyImageRepository.save({
            url: el,
            story: result,
          }),
        ),
      );
    }
    return result;
  }

  async update({ id, userId, updateStoryInput }) {
    const { imgUrl, ...rest } = updateStoryInput;
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const storyToUpdate = await this.storyRepository.findOne({
      where: {
        id,
        user,
      },
    });

    const result = await this.storyRepository.save({
      ...storyToUpdate,
      id,
      ...rest,
    });

    this.storyImageRepository.delete({ story: id });

    if (imgUrl !== undefined) {
      await Promise.all(
        imgUrl.map((el) => {
          this.storyImageRepository.save({
            url: el,
            story: id,
          });
        }),
      );
    }
    return result;
  }

  async deleteOwn({ id, userId }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    await this.storyImageRepository.softDelete({ story: { id } });

    const result = await this.storyRepository.softDelete({
      id,
      user,
    });
    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    await this.storyImageRepository.softDelete({ story: { id } });

    const result = await this.storyRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async userLikeStory({ userId, storyId }) {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['likedusers'],
    });
    const usersArray = story.likedusers;

    if (usersArray.some((el) => el.id === userId))
      throw new ConflictException('이미 좋아요를 눌렀습니다.');

    const user = await this.usersService.findOneWithId({ userId });

    usersArray.push(user);

    return this.storyRepository.save({
      ...story,
      id: storyId,
      likedusers: usersArray,
      likes: usersArray.length,
    });
  }

  async userUndoLikeStory({ userId, storyId }) {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['likedusers'],
    });

    if (story.likedusers.every((el) => el.id !== userId))
      throw new ConflictException('좋아요를 누르시지 않은 사연입니다.');

    const usersArray = story.likedusers.filter((el) => el.id !== userId);

    return this.storyRepository.save({
      ...story,
      id: storyId,
      likedusers: usersArray,
      likes: usersArray.length,
    });
  }
}
