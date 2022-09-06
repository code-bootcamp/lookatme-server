import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryImage } from '../storyImages/entities/storyImage.entity';
import { User } from '../users/entities/user.entity';
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
  ) {}

  async find() {
    return await this.storyRepository.find();
  }

  async create({ createStoryInput, userId }) {
    const { text, imgUrl, categoryId } = createStoryInput;

    const writer = await this.userRepository.findOne({ where: { id: userId } });

    const result = await this.storyRepository.save({
      text,
      category: { id: categoryId },
      user: writer,
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
    const writer = await this.userRepository.findOne({ where: { id: userId } });

    const storyForUpdate = await this.storyRepository.findOne({
      where: {
        id,
        user: writer,
      },
    });

    const result = await this.storyRepository.save({
      ...storyForUpdate,
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
    const writer = await this.userRepository.findOne({ where: { id: userId } });

    const result = await this.storyRepository.softDelete({
      id,
      user: writer,
    });
    return result.affected ? true : false;
  }

  async deleteReported({ id }) {
    const result = await this.storyRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
