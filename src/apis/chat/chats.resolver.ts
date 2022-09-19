import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { ChatsService } from './chats.service';
import { ChatList } from './dto/chatList.output';

/**
 *  Description : API docs for chat setting
 *  Constructor : ChatsService
 *  Content :
 *    [ Query ]
 *      fetchChatLogs       [ ticketId: String => [ChatList] ]
 *                            : 채팅 기록 조회 API
 */

@Resolver()
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ChatList], { description: '채팅 기록 조회' })
  fetchChatLogs(
    @Args('ticketId') ticketId: string, //
  ) {
    return this.chatsService.load({ ticketId });
  }
}
