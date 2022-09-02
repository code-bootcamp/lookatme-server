import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardImage } from '../boardImages/entities/boardImage.entity';
import { Mood } from '../moods/entities/mood.entity';
import { CreateProductInput } from '../products/dto/createProduct.input';
import { ProductService } from '../products/product.service';
import { Tag } from '../tags/entities/tag.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardImage)
    private readonly boardImageRepository: Repository<BoardImage>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Mood)
    private readonly moodRepository: Repository<Mood>,
    private readonly productService: ProductService,
  ) {}

  async findAll() {
    return await this.boardRepository.find();
  }

  async create({ createBoardInput, userId }) {
    const { products, url, tags, moodId, ...board } = createBoardInput;
    const inputTags = [];
    const inputMoods = [];

    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i].replace('#', '');
      const prevTag = await this.tagRepository.findOne({
        where: { name: tagName }, //
      });
      if (prevTag) {
        inputTags.push(prevTag);
      } else {
        const newTag = await this.tagRepository.save({ name: tagName });
        inputTags.push(newTag);
      }
    }

    for (const el of moodId) {
      const mood = await this.moodRepository.findOne({ where: { id: el } });
      inputMoods.push(mood);
    }

    const result = await this.boardRepository.save({
      ...board,
      user: userId,
      tags: inputTags,
      moods: inputMoods,
    });

    await Promise.all(
      products.map((el: CreateProductInput) =>
        this.productService.create({ createProductInput: el, userId }),
      ),
    );

    await Promise.all(
      url.map((el) => {
        this.boardImageRepository.save({ url: el, board: result.id });
      }),
    );

    return result;
  }
}
