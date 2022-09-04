import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ChatMessage } from './entities/chatMessage.entity';
import { User } from '../users/entities/user.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
@Injectable()
export class ChatsGateway {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private readonly userRepositoey: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('message')
  async connectSomeone(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    // 채팅방 입장!
    const [nickname, room] = data;
    const receive = `${nickname}님이 입장했습니다.`;
    this.server.emit('receive' + room, receive);
    this.wsClients.push(client);
  }

  // 다른사람한테 메시지 뿌리기
  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  async sendMessage(
    @MessageBody() data: string, //
    @ConnectedSocket() client,
  ) {
    const [room, nickname, message] = data;

    // 1. 유저 찾아오기
    const user = await this.userRepositoey.findOne({
      where: { nickname: nickname },
    });

    // 2. 채팅방 찾아오기
    let chatRoom = await this.chatRoomRepository.findOne({
      where: { room: room },
    });

    if (!chatRoom)
      chatRoom = await this.chatRoomRepository.save({
        room: room,
      });

    // 3. 채팅 저장하기
    await this.chatMessageRepository.save({
      user: user,
      room: chatRoom,
      message: data[2],
    });

    this.broadcast(room, client, [nickname, message]);
  }
}
