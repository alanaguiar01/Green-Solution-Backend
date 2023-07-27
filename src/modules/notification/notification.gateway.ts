import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CookieAuthGuard } from '~/guards/ws-auth.guard';

@WebSocketGateway()
// @UseGuards(CookieAuthGuard)
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private userIdToSocketIdMap: Map<string, string> = new Map<string, string>();
  private logger = new Logger(NotificationGateway.name);
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // const userId = client.handshake.headers.authorization; // Assumindo que o token é passado como um parâmetro de consulta 'token'
    // client.join(`notifications_${userId}`);
    this.logger.log(`Client connected: ${client.id}`);
  }
  getSocketIdByUserId(userId: string): string | undefined {
    return this.userIdToSocketIdMap.get(userId);
  }
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconected: ${client.id}`);
  }

  // Métodos para manipular eventos do socket, como receber e enviar notificações, podem ser definidos aqui usando decorators como `@SubscribeMessage`.

  // Resto da implementação do gateway...
}
