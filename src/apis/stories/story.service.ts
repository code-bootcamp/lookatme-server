import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryImage } from '../storyImages/entities/storyImage.entity';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>, //
    @InjectRepository(StoryImage)
    private readonly storyImageRepository: Repository<StoryImage>,
  ) {}

  async create({ createStoryInput }) {
    const { text, imgUrl, categoryId } = createStoryInput;

    const result = await this.storyRepository.save({
      text,
      category: { id: categoryId },
    });

    // 사연 등록시 이미지를 첨부해야 실행되는 코드
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
}
