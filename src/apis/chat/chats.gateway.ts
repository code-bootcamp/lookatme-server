import { Server } from 'socket.io';
import {
  ConnectedSocket,
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
  cors: { origin: true, credentials: true },
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

  // wsClients = [];

  @SubscribeMessage('user_enter')
  async connectUser(
    @MessageBody() ticketId: string, //
    @ConnectedSocket() client,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['user'],
    });

    const nickname = ticket.user.nickname;
    const message = `${nickname}님이 입장했습니다.`;

    client.join(ticketId);
    this.server
      .to(ticketId)
      .emit('receive', { nickname, message, sender: 'user', type: 'enter' });
    // this.wsClients.push(client);
  }

  @SubscribeMessage('specialist_enter')
  async connectSpecialist(
    @MessageBody() ticketId: string, //
    @ConnectedSocket() client,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['specialist'],
    });

    const nickname = ticket.specialist.name;
    const message = `${nickname}님이 입장했습니다.`;

    client.join(ticketId);
    this.server.to(ticketId).emit('receive', {
      nickname,
      message,
      sender: 'specialist',
      type: 'enter',
    });
    // this.wsClients.push(client);
  }

  // private broadcast(event, client, message: any) {
  //   for (const c of this.wsClients) {
  //     if (client.id == c.id) continue;
  //     c.emit(event, message);
  //   }
  // }

  @SubscribeMessage('user_send')
  async sendUserMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [ticketId, message] = data;

    const result = await this.chatsService.userSend({
      ticketId,
      message,
    });

    const nickname = result.user.nickname;

    // this.broadcast(ticketId, client, [nickname, message, 'user']);
    client.join(ticketId);
    this.server
      .to(ticketId)
      .emit('receive', { nickname, message, sender: 'user', type: 'send' });
  }

  @SubscribeMessage('specialist_send')
  async sendSpecialistMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [ticketId, message] = data;

    const result = await this.chatsService.specialistSend({
      ticketId,
      message,
    });

    const nickname = result.specialist.name;

    // this.broadcast(ticketId, client, [nickname, message, 'specialist']);
    client.join(ticketId);
    this.server.to(ticketId).emit('receive', {
      nickname,
      message,
      sender: 'specialist',
      type: 'send',
    });
  }
}
