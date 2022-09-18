import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chatMessage.entity';
import { SpecialistChatMessage } from './entities/specialistChatMessage.entity';
import { User } from '../user/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { AUTHOR } from 'src/commons/type/enum';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(SpecialistChatMessage)
    private readonly specialistChatMessageRepository: Repository<SpecialistChatMessage>,

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
      relations: ['user', 'specialist'],
    });

    if (!ticket)
      throw new UnprocessableEntityException('존재하지 않는 ticket입니다');

    const chatMessages = await this.chatMessageRepository
      .createQueryBuilder('chatMessage')
      .leftJoinAndSelect('chatMessage.ticket', 'ticket')
      .where('chatMessage.ticket = :ticketId', { ticketId })
      .getMany();

    const specialistChatMessages = await this.specialistChatMessageRepository
      .createQueryBuilder('specialistChatMessageRepository')
      .leftJoinAndSelect('specialistChatMessageRepository.ticket', 'ticket')
      .where('specialistChatMessageRepository.ticket = :ticketId', { ticketId })
      .getMany();

    const userChatList = chatMessages.map((ele) => {
      return {
        author: AUTHOR.USER,
        nickname: ticket.user.nickname,
        message: ele.message,
        createdAt: ele.createdAt,
      };
    });

    const specialistChatList = specialistChatMessages.map((ele) => {
      return {
        author: AUTHOR.SPECIALIST,
        nickname: ticket.specialist.name,
        message: ele.message,
        createdAt: ele.createdAt,
      };
    });

    const result = [...userChatList, ...specialistChatList];

    result.sort((a, b) => {
      if (a.createdAt > b.createdAt) return 1;
      if (a.createdAt < b.createdAt) return -1;
      return 0;
    });

    return result;
  }

  async userSend({ ticketId, message }) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });

    const user = await this.userRepository.findOne({
      where: { id: ticket.user.id },
    });

    const result = await this.chatMessageRepository.save({
      user,
      message,
      ticket,
    });

    return result;
  }

  async specialistSend({ ticketId, message }) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['specialist'],
    });

    const specialist = await this.specialistRepository.findOne({
      where: { id: ticket.specialist.id },
    });

    const result = await this.specialistChatMessageRepository.save({
      specialist,
      message,
      ticket,
    });

    return result;
  }
}
