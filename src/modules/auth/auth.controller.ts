import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/userCredentialsDto';
import { JwtAuthGuard } from './jwtAuth.guard';
import { Request } from 'express';
import { ValidationError } from 'class-validator';
import { UserService } from '../user/user.service';
import { TokenResponseDto } from './dto/tokenResponseDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async signUser(
    @Body() payload: UserCredentialsDto,
  ): Promise<TokenResponseDto> {
    const { email, password } = payload;
    const tokenDto = await this.authService.createToken(email, password);

    if (!tokenDto) {
      const error: ValidationError = {
        property: 'password',
        constraints: {
          isValidCredentials:
            "Provided email address and password don't match.",
        },
        children: [],
      };

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: [error],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.saveToken(email, tokenDto.accessToken);

    return tokenDto;
  }

  @Post('/register')
  async registerUser(
    @Body() payload: UserCredentialsDto,
  ): Promise<TokenResponseDto> {
    const { email, password } = payload;
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const error: ValidationError = {
        property: 'email',
        constraints: {
          isValidCredentials: 'Account with this email address already exists.',
        },
        children: [],
      };

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: [error],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await this.authService.createPasswordHash(password);
    await this.userService.create(email, passwordHash);

    const tokenDto = await this.authService.createToken(email, password);
    await this.userService.saveToken(email, tokenDto.accessToken);
    return tokenDto;
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logoutUser(@Req() request: Request): Promise<boolean> {
    const { userId } = request.user;
    await this.userService.destroyToken(userId);
    return true;
  }
}
