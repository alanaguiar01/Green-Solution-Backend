import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '~/modules/auth/auth.service';
import { User } from '~/modules/user/entities/user.entity';
import { UserService } from '~/modules/user/user.service';
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
  /**
   * It checks if a token exists for a given email, if it does, it updates the token, if it doesn't, it
   * creates a new token
   * @param {string} token - The token that will be saved in the database.
   * @param {string} email - The email address of the user who is requesting a password reset.
   */
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

  /**
   * It takes an old token, finds the user associated with it, and returns a new token
   * @param {string} oldToken - The token that needs to be refreshed.
   * @returns The token is being returned.
   */
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

  /**
   * It takes a token as a parameter, finds the user associated with that token, and returns the user
   * @param {string} token - The token that was sent in the request header.
   * @returns The user object
   */
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
