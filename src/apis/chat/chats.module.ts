import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { User } from '../user/entities/user.entity';
import { SpecialistChatMessage } from './entities/specialistChatMessage.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { UsersService } from '../user/users.service';
import { SpecialistService } from '../specialist/specialists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom, //
      ChatMessage,
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
    UsersService,
    SpecialistService,
  ],
})
export class ChatsModule {}
