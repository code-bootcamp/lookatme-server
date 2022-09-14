import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatMessage } from './entities/chatMessage.entity';
import { SpecialistChatMessage } from './entities/specialistChatMessage.entity';
import { User } from '../user/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Ticket } from '../ticket/entities/ticket.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(SpecialistChatMessage)
    private readonly specialistChatMessageRepository: Repository<SpecialistChatMessage>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
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

  async userSend({ userId, ticketId, message }) {
    // 1. 유저 찾아오기
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 2. 채팅방 찾아오기
    let chatRoom = await this.chatRoomRepository.findOne({
      where: { room: ticketId },
    });

    // 3. 채팅방 없으면 생성해주기
    if (!chatRoom)
      chatRoom = await this.chatRoomRepository.save({
        room: ticketId,
      });

    // 4. ticket과 채팅방 연결하기
    await this.ticketRepository.update(
      { id: ticketId },
      { chatRoom: chatRoom },
    );

    // 5. 채팅내용 저장하기
    await this.chatMessageRepository.save({
      user: user,
      room: chatRoom,
      message: message,
    });

    return user.nickname;
  }

  async specialistSend({ specialistId, ticketId, message }) {
    // 1. 전문가 찾아오기
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    console.log('___________________');

    if (!specialist)
      throw new UnprocessableEntityException(
        '존재하지 않는 specialist_id 입니다.',
      );

    // 2. 채팅방 찾아오기
    let chatRoom = await this.chatRoomRepository.findOne({
      where: { room: ticketId },
    });

    // 3. 채팅방 없으면 생성해주기
    if (!chatRoom)
      chatRoom = await this.chatRoomRepository.save({
        room: ticketId,
      });

    // 4. ticket과 채팅방 연결하기
    await this.ticketRepository.update(
      { id: ticketId },
      { chatRoom: chatRoom },
    );

    // 5. 채팅 저장하기
    await this.specialistChatMessageRepository.save({
      specialist: specialist,
      room: chatRoom,
      message: message,
    });

    return specialist.name;
  }
}
