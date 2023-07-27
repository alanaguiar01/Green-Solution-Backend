import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '~/modules/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from '~/modules/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}
  /**
   * It takes a CreateUserDto object as an argument, checks if the user already exists, and if not,
   * creates a new user
   * @param {CreateUserDto} createAuthDto - CreateUserDto
   * @returns The new user
   */
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

  /**
   * It takes an AuthDto object, finds a user by email, and if the user exists and the password is
   * correct, it returns the user object without the password
   * @param {AuthDto} authDto - AuthDto - This is the DTO that we created earlier.
   * @returns The user object without the password.
   */
  async validateUser(authDto: AuthDto): Promise<any> {
    const user = await this.userService.findOneByEmail(authDto.email);
    const validPassword = await user.checkPassword(authDto.password);
    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * It takes a user object, creates a JWT payload, signs the payload, saves the token to the token
   * service, and returns the token
   * @param {any} user - any - this is the user object that is returned from the AuthService.login()
   * method.
   * @returns The access token is being returned.
   */
  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.tokenService.save(token, user.email);
    return {
      access_token: token,
    };
  }

  /**
   * It takes a token, gets the user from the token, and signs in the user
   * @param {string} token - The token that was passed in the request header.
   * @returns A promise that resolves to a user object.
   */
  async loginWithAuth(token: string) {
    const user = await this.tokenService.getUserByToken(token);
    if (user) {
      return this.signIn(user);
    }
    throw new HttpException('token invalid', HttpStatus.UNAUTHORIZED);
  }

  /**
   * It takes a token, verifies it, and returns the user that the token belongs to
   * @param {string} token - The token that was passed in the request header.
   * @returns The user object
   */
  // async verifyToken(token: string): Promise<any> {
  //   try {
  //     const decoded = this.jwtService.verify(token);
  //     return decoded;
  //   } catch (error) {
  //     // Caso ocorra algum erro na verificação do token, como token inválido ou expirado, você pode tratar o erro aqui.
  //     throw new Error('Token inválido');
  //   }
  // }
  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findOneById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token.');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
