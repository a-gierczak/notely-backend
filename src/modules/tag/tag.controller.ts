import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { Request } from 'express';
import { TagDto } from './dto/tagDto';
import { CreateTagDto } from './dto/createTagDto';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(@Req() request: Request): Promise<TagDto[]> {
    const { userId } = request.user;
    return TagDto.fromEntities(await this.tagService.findAll(userId));
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body() tagDto: CreateTagDto,
  ): Promise<TagDto> {
    const { userId } = request.user;
    const { name } = tagDto;
    const tag = new Tag();
    tag.name = name;
    tag.user = userId;
    return TagDto.fromEntity(await this.tagService.create(tag));
  }

  @Get('search/:query')
  async search(
    @Req() request: Request,
    @Param('query') query: string,
  ): Promise<Tag[]> {
    const { userId } = request.user;
    return this.tagService.search(userId, query);
  }
}
