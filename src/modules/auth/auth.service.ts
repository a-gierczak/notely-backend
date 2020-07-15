import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { addSeconds } from 'date-fns';
import { JwtPayload } from './jwtPayload';
import { User } from '../user/user.entity';
import { TokenResponseDto } from './dto/tokenResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(token: string, payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    return await this.userService.findOneByIdAndToken(userId, token);
  }

  async createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async createToken(
    email: string,
    password: string,
  ): Promise<TokenResponseDto> {
    const user = await this.userService.findOneByEmail(email);
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return null;
    }

    const payload: JwtPayload = {
      userId: user.id,
    };
    const accessToken = await this.jwtService.sign(payload);

    return {
      expires: addSeconds(new Date(), 24 * 60 * 60),
      accessToken,
    };
  }
}
