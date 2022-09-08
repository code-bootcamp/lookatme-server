import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { DEFAULT_QUOTE_LIST } from './defaultQuoteList';

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

  async findSelectedQuote() {
    const result = await this.quoteRepository.findOne({
      where: { isSelected: true },
    });

    if (!result)
      throw new UnprocessableEntityException('선택된 명언이 없습니다.');

    return result;
  }

  async create({ createQuoteInput }) {
    return this.quoteRepository.save({ ...createQuoteInput });
  }

  async createList() {
    return await Promise.all(
      DEFAULT_QUOTE_LIST.map((el) => this.quoteRepository.save({ ...el })),
    );
  }

  async update({ id, updateQuoteInput }) {
    const quoteForUpdate = this.quoteRepository.findOne({ where: { id } });

    if (!quoteForUpdate)
      throw new UnprocessableEntityException('존재하지 않는 id값입니다.');

    const result = await this.quoteRepository.save({
      ...quoteForUpdate,
      id,
      ...updateQuoteInput,
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

  async selectRandomQuote() {
    // 1. 기존 selected quote 취소하기
    const oldQuote = await this.quoteRepository.findOne({
      where: { isSelected: true },
    });

    if (oldQuote)
      await this.quoteRepository.update(
        { id: oldQuote.id },
        { isSelected: false },
      );

    // 2. 랜덤한 quote 선정하기
    const randomQuote = await this.quoteRepository
      .createQueryBuilder()
      .orderBy('RAND()')
      .getMany();

    if (!randomQuote)
      throw new UnprocessableEntityException('명언을 생성해 주세요');

    return await this.quoteRepository.save({
      ...randomQuote[0],
      id: randomQuote[0].id,
      isSelected: true,
    });
  }
}
