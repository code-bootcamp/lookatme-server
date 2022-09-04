import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom, //
      ChatMessage,
      User,
    ]),
  ],
  providers: [
    ChatsResolver, //
    ChatsService,
    ChatsGateway,
  ],
})
export class ChatsModule {}
