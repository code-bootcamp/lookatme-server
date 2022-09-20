import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async find({ storyId }) {
    return await this.storyRepository.findOne({
      where: { id: storyId },
      relations: [
        'user',
        'category',
        'comments',
        'storyImage',
        'specialistComments',
      ],
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
    if (categoryName) {
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

    return await this.storyRepository.find({
      relations: ['user', 'category'],
      order: { createAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAllByLike({ categoryName, page }) {
    if (categoryName) {
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

    return await this.storyRepository.find({
      relations: ['user', 'category'],
      order: { likes: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findAllByComment({ categoryName, page }) {
    if (categoryName) {
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

    return await this.storyRepository.find({
      relations: ['user', 'category'],
      order: { commentCounts: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findReportedStories({ page }) {
    return await this.storyRepository.find({
      where: { isReported: true },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findOwnStories({ userId, page }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 계정입니다.');

    return this.storyRepository.find({
      where: { user: user },
      relations: ['user', 'category'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({ createStoryInput, userId }) {
    const { title, text, imgUrl, categoryName } = createStoryInput;
    const category = { id: '', name: '' };
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnprocessableEntityException('존재하지 않는 유저입니다.');
    }

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
    const { imgUrl, categoryName, ...rest } = updateStoryInput;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const category = { id: '', name: '' };

    const existCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (existCategory) {
      category.id = existCategory.id;
      category.name = existCategory.name;
    } else {
      const newCategory = await this.categoryRepository.save({
        name: categoryName,
      });

      category.id = newCategory.id;
      category.name = newCategory.name;
    }

    const storyToUpdate = await this.storyRepository.findOne({
      where: {
        id,
        user,
      },
    });

    const result = await this.storyRepository.save({
      ...storyToUpdate,
      id,
      category,
      ...rest,
    });

    await this.storyImageRepository.delete({ story: id });

    if (imgUrl !== undefined) {
      await Promise.all(
        imgUrl.map((el) => {
          this.storyImageRepository.save({
            url: el,
            story: result,
          });
        }),
      );
    }

    return result;
  }

  async deleteOwn({ id, userId }) {
    const result = await this.storyRepository.delete({
      id,
      user: { id: userId },
    });
    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.storyRepository.delete({ id });
    return result.affected ? true : false;
  }

  async userLikeStory({ userId, storyId }) {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['likedusers'],
    });
    const usersArray = story.likedusers;

    if (usersArray.some((el) => el.id === userId)) {
      const likeUser = usersArray.find((el) => el.id === userId);
      const idx = usersArray.indexOf(likeUser);
      usersArray.splice(idx, 1);
    } else {
      const user = await this.usersService.findOneWithId({ userId });
      usersArray.push(user);
    }

    return this.storyRepository.save({
      ...story,
      id: storyId,
      likedusers: usersArray,
      likes: usersArray.length,
    });
  }

  async report({ storyId }) {
    const storyToReport = await this.storyRepository.findOne({
      where: { id: storyId },
    });

    const result = await this.storyRepository.save({
      ...storyToReport,
      id: storyId,
      isReported: true,
    });

    return result.isReported ? true : false;
  }
}
