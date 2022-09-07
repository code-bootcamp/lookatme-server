import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SpecialistService } from '../specialists/specialist.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*', credentials: true },
})
@Injectable()
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,

    private readonly usersService: UsersService,

    private readonly specialistsService: SpecialistService,
  ) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('user_enter')
  async connectUser(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    // 채팅방 입장!
    const [ticketId, userId] = data;

    // 유저 닉네임 찾아오기
    const user = await this.usersService.findOneWithId({ userId });

    const receive = `${user.nickname}님이 입장했습니다.`;

    this.server.emit('receive' + ticketId, receive);
    this.wsClients.push(client);
  }

  @SubscribeMessage('specialist_enter')
  async connectSpecialist(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    // 채팅방 입장!
    const [ticketId, specialistId] = data;

    // 전문가 이름 찾아오기
    const specialist = await this.specialistsService.findOneWithId({
      id: specialistId,
    });

    const receive = `${specialist.name}님이 입장했습니다.`;

    this.server.emit('receive' + ticketId, receive);
    this.wsClients.push(client);
  }

  // 다른사람한테 메시지 뿌리기
  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('user_send')
  async sendUserMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [ticketId, message, userId] = data;

    // 채팅 기록 저장 및 유저 닉네임 불러오기
    const nickname = await this.chatsService.userSend({
      userId,
      ticketId,
      message,
    });

    this.broadcast(ticketId, client, [nickname, message]);
  }

  @SubscribeMessage('specialist_send')
  async sendSpecialistMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [ticketId, message, specialistId] = data;

    // 채팅 기록 저장 및 전문가 이름 불러오기
    const nickname = await this.chatsService.specialistSend({
      specialistId,
      ticketId,
      message,
    });

    this.broadcast(ticketId, client, [nickname, message]);
  }
}
