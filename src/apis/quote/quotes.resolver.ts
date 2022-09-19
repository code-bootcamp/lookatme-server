import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAdminAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateQuoteInput } from './dto/createQuote.input';
import { UpdateQuoteInput } from './dto/updateQuote.input';
import { Quote } from './entities/quote.entity';
import { QuoteService } from './quotes.service';

/**
 *  Description : API docs for quote setting
 *  Constructor : QuoteService
 *  Content :
 *    [ Query ]
 *      fetchQuotes               [ page: Int => [Quote] ]
 *                                  : 명언 전체 목록 조회 API
 *      fetchQuote                [ id: String => Quote ]
 *                                  : ID로 명언 조회 API
 *      fetchSelectedQuote        [ None => Quote ]
 *                                  : /batches/start/quote API로 선택된 명언 조회
 *    [ Mutation ]
 *      createQuote               [ createQuoteInput: CreateQuoteInput => Quote ]
 *                                  : 명언 등록 API
 *      createQuoteList           [ None => [Quote] ]
 *                                  : 디폴트 명언 목록 등록 API
 *      updateQuote               [ id: String, createQuoteInputc: CreateQuoteInput => Quote ]
 *                                  : 명언 수정 API
 *      deleteQuote               [ id: String => Boolean ]
 *                                  : 명언 삭제 API
 */

@Resolver()
export class QuoteResolver {
  constructor(
    private readonly quoteService: QuoteService, //
  ) {}

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [Quote], { description: '명언 전체 목록 조회' })
  async fetchQuotes(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.quoteService.findAll({ page });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => Quote, { description: 'ID로 명언 조회' })
  async fetchQuote(
    @Args('id') id: string, //
  ) {
    return this.quoteService.findOne({ id });
  }

  @Query(() => Quote, {
    description: '/batches/start/quote API로 선택된 명언 조회',
  })
  async fetchSelectedQuote() {
    return this.quoteService.findSelectedQuote();
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Quote, { description: '명언 등록' })
  async createQuote(
    @Args('createQuoteInput') createQuoteInput: CreateQuoteInput, //
  ) {
    return await this.quoteService.create({ createQuoteInput });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => [Quote], { description: '디폴트 명언 목록 등록' })
  async createQuoteList() {
    return this.quoteService.createList();
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Quote, { description: '명언 수정' })
  async updateQuote(
    @Args('id') id: string, //
    @Args('updateQuoteInput') updateQuoteInput: UpdateQuoteInput,
  ) {
    return await this.quoteService.update({ id, updateQuoteInput });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '명언 삭제' })
  async deleteQuote(@Args('id') id: string) {
    return await this.quoteService.delete({ id });
  }
}
