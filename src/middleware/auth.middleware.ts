import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const secret = this.config.get('JWT_ACCESS_SECRET');
    if (authHeader && (authHeader as string).split(' ')[1]) {
      const token = (authHeader as string).split(' ')[1];
      const decoded: any = this.jwtService.verify(token, secret);
      const user = this.userService.findOneById(decoded.id);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
