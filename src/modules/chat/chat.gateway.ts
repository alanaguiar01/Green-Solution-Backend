import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';
import { CreatePrivateMessageDto } from './dto/create-chat.dto';
import { NotificationService } from '../notification/notification.service';
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {}
  connectedUsers: Map<string, Socket> = new Map();
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');
  async handleConnection(@ConnectedSocket() client: Socket) {
    // this.logger.log('Connected User:', client.id);
    try {
      // this.server.on('events', (data) => console.log(data));
      const user = await this.chatService.getUserFromSocket(client);
      this.connectedUsers.set(client.id, client);
      console.log(user);
      // this.chatService.initJoin(user, client);
      this.logger.log('connected');
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  // @SubscribeMessage('events')
  // @UseGuards(CookieAuthGuard)
  // handleEvent(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): string {
  //   console.log(data);
  //   return data;
  // }
  async handleDisconnect(client: Socket) {
    this.logger.log('Disconnected User:', client.id);
    client.disconnect();
  }
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('createMessage')
  async handleprivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreatePrivateMessageDto,
  ): Promise<void> {
    const authUser = await this.chatService.getUserFromSocket(client);
    const receiver = await this.userService.findOneById(body.receiver);
    const createdMessage = await this.chatService.createMessage(
      authUser.id,
      receiver.id,
      body.text,
    );
    const room = await this.chatService.checkPrivateRoomExists(
      authUser,
      receiver,
    );
    const receiverSocket = this.connectedUsers.set(receiver.id, client);
    receiverSocket.get(receiver.id).join(room.name);
    client.join(room.name);

    this.notificationService.sendNotification({
      receiver: receiver.id,
      sender: authUser.id,
      text: body.text,
    });

    this.server.to(room.name).emit('outputMessage', createdMessage);

    receiverSocket.get(receiver.id).emit('notification', {
      sender: authUser.name,
      text: body.text,
    });
  }
}
// Método para conectar o socket do receptor
// if (notificationPersist) {
//   this.server.to('notifications_' + receiver).emit('notifications', 'oi');
// }
// this.notificationService.sendNotification(
//   authUser.id,
//   receiver.id,
//   body.text,
// );
// const socketsInRoom = Array.from(
//   this.server.sockets.adapter.rooms.get(room.name) || [],
// );
// const connectedSockets = socketsInRoom.map((socketId) => ({
//   socketId,
//   socket: this.server.sockets.sockets.get(socketId),
// }));
// console.log(
//   'Sockets conectados na sala',
//   room.name + ':',
//   connectedSockets,
// );
