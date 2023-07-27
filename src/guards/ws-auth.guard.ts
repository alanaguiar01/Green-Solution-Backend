import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToWs();
    const client = ctx.getClient<Socket>();
    const token = client.handshake.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = this.jwtService.verify(token);
      ctx.getClient = payload;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
    return true;
  }
}
