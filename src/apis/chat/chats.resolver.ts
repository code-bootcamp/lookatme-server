import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { ChatsService } from './chats.service';
import { ChatMessage } from './entities/chatMessage.entity';

@Resolver()
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ChatMessage], { description: '채팅 기록 조회' })
  fetchChatLogs(@Args('room') roomCode: string) {
    return this.chatsService.load({ roomCode });
  }
}
