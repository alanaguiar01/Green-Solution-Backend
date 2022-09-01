import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
@WebSocketGateway({ transports: ['websockets'] })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const authUser = await this.chatService.getUserFromSocket(client);
      if (!authUser) {
        return this.disconnect(client);
      } else {
        this.chatService.initJoin(authUser, client);
        this.logger.log(`Client connected: ${client.id}`);
      }
    } catch (err) {}
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
