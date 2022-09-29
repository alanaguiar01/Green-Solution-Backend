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
import { Logger, UnauthorizedException } from '@nestjs/common';
import { CreatePrivateMessageDto } from './dto/create-chat.dto';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
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
  ) {}
  connectedUsers: Map<string, string> = new Map();
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const user = await this.chatService.getUserFromSocket(client);
      this.chatService.initJoin(user, client);
      this.logger.log('connected');
    } catch (err) {
      throw new WsException(err.message);
    }
  }
  async handleDisconnect(client: Socket) {
    // this.connectedUsers.delete('userId');
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
      receiver,
      body.text,
    );
    const room = await this.chatService.checkPrivateRoomExists(
      authUser.id,
      receiver.id,
    );
    this.server.to(room.name).emit('outputMessage', createdMessage);
  }
}
