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
    @Inject('TOKEN_REPOSITORY')
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async save(token: string, email: string) {
    const objToken = await this.tokenRepository.findOne({ where: { email } });
    if (objToken) {
      this.tokenRepository.update(objToken.id, { token });
    } else {
      this.tokenRepository.insert({
        token: token,
        email: email,
      });
    }
  }

  async refreshToken(oldToken: string) {
    const objToken = await this.tokenRepository.findOne({
      where: { token: oldToken },
    });
    if (!objToken) {
      throw new HttpException('Not has token', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findOneByEmail(objToken.email);
    if (!user) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    return this.authService.signIn(user);
  }

  async getUserByToken(token: string): Promise<User> {
    token = token.replace('Bearer ', '').trim();
    const objToken: Token = await this.tokenRepository.findOne({
      where: { token },
    });
    if (objToken) {
      const user = await this.userService.findOneByEmail(objToken.email);
      return user;
    } else {
      throw new HttpException('Error saving token', HttpStatus.BAD_REQUEST);
    }
  }
}
