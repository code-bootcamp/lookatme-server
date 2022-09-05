import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
  ) {}

  async findAll() {
    return this.quoteRepository.find();
  }

  async findOne({ id }) {
    const result = await this.quoteRepository.findOne({ where: { id } });

    if (!result)
      throw new UnprocessableEntityException('존재하지 않는 id입니다.');

    return result;
  }

  async create({ text }) {
    return this.quoteRepository.save({ text });
  }

  async update({ id, text }) {
    const quoteForUpdate = this.quoteRepository.findOne({ where: { id } });

    if (!quoteForUpdate)
      throw new UnprocessableEntityException('존재하지 않는 id값입니다.');

    const result = await this.quoteRepository.save({
      ...quoteForUpdate,
      id,
      text,
    });
    return result;
  }

  async delete({ id }) {
    const quoteForDelete = await this.quoteRepository.findOne({
      where: { id },
    });

    if (!quoteForDelete)
      throw new UnprocessableEntityException('존재하지 않는 id 입니다.');

    const result = await this.quoteRepository.delete({ id });

    return result.affected ? true : false;
  }
}
