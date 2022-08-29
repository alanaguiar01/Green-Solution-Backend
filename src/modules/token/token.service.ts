import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async save(token: string, email: string) {
    try {
      const objToken = await this.tokenRepository.findOne({ where: { email } });
      if (objToken) {
        this.tokenRepository.update(objToken.id, { token });
      } else {
        this.tokenRepository.insert({
          token: token,
          email: email,
        });
      }
    } catch (err) {
      throw new HttpException('Error saving token', err);
    }
  }

  async refreshToken(oldToken: string) {
    try {
      const objToken = await this.tokenRepository.findOne({
        where: { token: oldToken },
      });
      const user = await this.userService.findOneByEmail(objToken.email);
      return this.authService.signIn(user);
    } catch (err) {
      return new HttpException(err, HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserByToken(token: string): Promise<User> {
    try {
      token = token.replace('Bearer ', '').trim();
      const objToken: Token = await this.tokenRepository.findOne({
        where: { token },
      });
      if (objToken) {
        const user = await this.userService.findOneByEmail(objToken.email);
        return user;
      } else {
        return null;
      }
    } catch (err) {
      throw new HttpException('Error saving token', err);
    }
  }
}
