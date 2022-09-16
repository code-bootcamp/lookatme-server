import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQuoteInput } from './dto/createQuote.input';
import { UpdateQuoteInput } from './dto/updateQuote.input';
import { Quote } from './entities/quote.entity';
import { QuoteService } from './quotes.service';

@Resolver()
export class QuoteResolver {
  constructor(
    private readonly quoteService: QuoteService, //
  ) {}

  @Query(() => [Quote], { description: '명언 전체 목록 조회' })
  async fetchQuotes(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.quoteService.findAll({ page });
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
    @Args('createQuoteInput') createQuoteInput: CreateQuoteInput, //
  ) {
    return await this.quoteService.create({ createQuoteInput });
  }

  @Mutation(() => [Quote], { description: '디폴트 명언 목록 등록' })
  async createQuoteList() {
    return this.quoteService.createList();
  }

  @Mutation(() => Quote, { description: '명언 수정' })
  async updateQuote(
    @Args('id') id: string, //
    @Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput,
  ) {
    return await this.quoteService.update({ id, updateQuoteInput });
  }

  @Mutation(() => Boolean, { description: '명언 삭제' })
  async deleteQuote(@Args('id') id: string) {
    return await this.quoteService.delete({ id });
  }
}
