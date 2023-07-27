import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  /**
   * It takes a JwtPayload object as an argument, and returns a Promise that resolves to a JwtPayload
   * object
   * @param {JwtPayload} payload - JwtPayload
   * @returns The payload is being returned.
   */
  async validate(payload: JwtPayload) {
    return payload;
  }
}
