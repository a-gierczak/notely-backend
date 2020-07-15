import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/dto/userResponseDto';
import { JwtAuthGuard } from 'src/modules/auth/jwtAuth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getCurrentUser(@Req() request: Request): Promise<UserResponseDto> {
    const { userId } = request.user;
    const user = await this.userService.findOne(userId);
    return UserResponseDto.fromEntity(user);
  }
}
