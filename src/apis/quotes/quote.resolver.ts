import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Quote } from './entities/quote.entity';
import { QuoteService } from './quote.service';

@Resolver()
export class QuoteResolver {
  constructor(
    private readonly quoteService: QuoteService, //
  ) {}

  @Query(() => [Quote], { description: '명언 전체 목록 조회' })
  async fetchQuotes() {
    return this.quoteService.findAll();
  }

  @Query(() => Quote, { description: '명언 조회' })
  async fetchQuote(@Args('id') id: string) {
    return this.quoteService.findOne({ id });
  }

  @Query(() => Quote, { description: '선택된 명언 조회' })
  async fetchSelectedQuote() {
    return this.quoteService.findSelectedQuote();
  }

  @Mutation(() => Quote, { description: '명언 등록' })
  async createQuote(
    @Args('text') text: string, //
  ) {
    return await this.quoteService.create({ text });
  }

  @Mutation(() => Quote, { description: '명언 수정' })
  async updateQuote(
    @Args('id') id: string, //
    @Args('text') text: string,
  ) {
    return await this.quoteService.update({ id, text });
  }

  @Mutation(() => Boolean, { description: '명언 삭제' })
  async deleteQuote(@Args('id') id: string) {
    return await this.quoteService.delete({ id });
  }
}
