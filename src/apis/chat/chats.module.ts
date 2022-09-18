import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { User } from '../user/entities/user.entity';
import { SpecialistChatMessage } from './entities/specialistChatMessage.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Ticket } from '../ticket/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage, //
      SpecialistChatMessage,
      User,
      Specialist,
      Ticket,
    ]),
  ],
  providers: [
    ChatsResolver, //
    ChatsService,
    ChatsGateway,
  ],
})
export class ChatsModule {}
