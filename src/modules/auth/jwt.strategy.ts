import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwtPayload';
import { Request } from 'express';

export const JWT_SECRET = 'sekretny_klucz';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<JwtPayload> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const user = await this.authService.validateUser(token, payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
