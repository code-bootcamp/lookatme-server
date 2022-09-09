import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entities/category.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { User } from '../user/entities/user.entity';
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
  ) {}

  async findAll() {
    return await this.storyRepository.find({
      relations: ['user', 'category'],
    });
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
}
