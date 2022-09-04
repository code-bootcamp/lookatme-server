import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async load({ roomCode }) {
    const room = await this.chatRoomRepository.findOne({
      where: { room: roomCode },
    });

    const result = await this.chatMessageRepository.find({
      where: { room: room },
      order: { createdAt: 'ASC' },
      relations: ['user', 'room'],
    });

    return result;
  }
}
