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

  async load({ ticketId }) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });

    if (!ticket)
      throw new UnprocessableEntityException('존재하지 않는 ticket입니다');

    const room = await this.chatRoomRepository.findOne({
      where: { ticket: ticket },
    });

    const result = await this.chatMessageRepository.find({
      where: { room: room },
      order: { createdAt: 'ASC' },
      relations: ['user', 'room'],
    });

    return result;
  }

  async userSend({ userId, ticketId, message }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    let chatRoom = await this.chatRoomRepository.findOne({
      where: { room: ticketId },
    });

    if (!chatRoom)
      chatRoom = await this.chatRoomRepository.save({
        room: ticketId,
      });

    await this.ticketRepository.update(
      { id: ticketId },
      { chatRoom: chatRoom },
    );

    await this.chatMessageRepository.save({
      user: user,
      room: chatRoom,
      message: message,
    });

    return user.nickname;
  }

  async specialistSend({ specialistId, ticketId, message }) {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    if (!specialist)
      throw new UnprocessableEntityException(
        '존재하지 않는 specialist_id 입니다.',
      );

    let chatRoom = await this.chatRoomRepository.findOne({
      where: { room: ticketId },
    });

    if (!chatRoom)
      chatRoom = await this.chatRoomRepository.save({
        room: ticketId,
      });

    await this.ticketRepository.update(
      { id: ticketId },
      { chatRoom: chatRoom },
    );

    await this.specialistChatMessageRepository.save({
      specialist: specialist,
      room: chatRoom,
      message: message,
    });

    return specialist.name;
  }
}
