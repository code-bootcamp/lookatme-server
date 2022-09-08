import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async find() {
    return await this.storyRepository.find();
  }

  async create({ createStoryInput, userId }) {
    const { text, imgUrl, categoryNumber } = createStoryInput;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const category = await this.categoryRepository.findOne({
      where: { number: categoryNumber },
    });
    const result = await this.storyRepository.save({
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

    const result = await this.storyRepository.softDelete({
      id,
      user,
    });
    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.storyRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
