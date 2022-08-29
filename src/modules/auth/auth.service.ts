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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}
  async singUp(createAuthDto: CreateUserDto): Promise<any> {
    try {
      const userExists = await this.userService.findOneByEmail(
        createAuthDto.email,
      );
      if (userExists) {
        throw new BadRequestException('user already exist');
      }
      //Hash password
      const hash = await argon2.hash(createAuthDto.password);
      const newUser = await this.userService.createUser({
        ...createAuthDto,
        password: hash,
      });
      return newUser;
    } catch (err) {
      throw new HttpException('error request', HttpStatus.BAD_REQUEST);
    }
  }

  async signIn(dto: AuthDto): Promise<any> {
    try {
      const user = await this.userService.findOneByEmail(dto.email);
      const passwordMatches = await argon2.verify(user.password, dto.password);
      if (passwordMatches) {
        const token = this.jwtService.sign({ sub: user.id, email: user.email });
        this.tokenService.save(token, user.email);
        return {
          access_token: token,
        };
      } else {
        throw new HttpException(
          'Email or Password wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
