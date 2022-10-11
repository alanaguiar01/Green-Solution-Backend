import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { TokenService } from 'src/modules/token/token.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
  ) {}
  async singUp(createAuthDto: CreateUserDto): Promise<any> {
    const userExists = await this.userService.findOneByEmail(
      createAuthDto.email,
    );
    if (userExists) {
      throw new BadRequestException('user already exist');
    }
    const newUser = await this.userService.createUser(createAuthDto);
    return newUser;
  }

  async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.userService.findOneByEmail(authDto.email);
    if (user && argon2.verify(user.password, authDto.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.tokenService.save(token, user.email);
    return {
      access_token: token,
    };
  }

  async loginWithAuth(token: string) {
    const user = await this.tokenService.getUserByToken(token);
    if (user) {
      return this.signIn(user);
    }
    throw new HttpException('token invalid', HttpStatus.UNAUTHORIZED);
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token);
    if (payload.userId) {
      return this.userService.findOneById(payload.userId);
    }
  }
}
