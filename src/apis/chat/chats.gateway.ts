import { Server } from 'socket.io';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Ticket } from '../ticket/entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: [
      true,
      `${process.env.CLIENT_DOMAIN}/`,
      `${process.env.LOCALHOST_DOMAIN}/`,
    ],
    // credentials: true,
  },
})
@Injectable()
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('user_enter')
  async connectUser(
    @MessageBody() ticketId: string, //
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });

    const receive = `${ticket.user.nickname}님이 입장했습니다.`;

    this.server.emit('receive' + ticketId, receive);
  }

  @SubscribeMessage('specialist_enter')
  async connectSpecialist(
    @MessageBody() ticketId: string, //
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['specialist'],
    });

    const receive = `${ticket.specialist.name}님이 입장했습니다.`;

    this.server.emit('receive' + ticketId, receive);
  }

  @SubscribeMessage('user_send')
  async sendUserMessage(
    @MessageBody() data: string, //
  ) {
    const [ticketId, message] = data;

    const result = await this.chatsService.userSend({
      ticketId,
      message,
    });

    const nickname = result.user.nickname;

    this.server.emit(ticketId, [nickname, message, 'user']);
  }

  @SubscribeMessage('specialist_send')
  async sendSpecialistMessage(
    @MessageBody() data: string, //
  ) {
    const [ticketId, message] = data;

    const result = await this.chatsService.specialistSend({
      ticketId,
      message,
    });

    const nickname = result.specialist.name;

    this.server.emit(ticketId, [nickname, message, 'specialist']);
  }
}
