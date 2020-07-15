import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPostDto';
import { TagService } from '../tag/tag.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { PostDto } from './dto/postDto';
import { TagDto } from '../tag/dto/tagDto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly tagService: TagService,
  ) {}

  @Get()
  async findAll(@Req() request: Request): Promise<PostDto[]> {
    const { userId } = request.user;
    return PostDto.fromEntities(await this.postService.findUserPosts(userId));
  }

  @Get('tag')
  async findAllGroupByTag(@Req() request: Request): Promise<TagDto[]> {
    const { userId } = request.user;
    const tagsWithPosts = await this.tagService.findUserPosts(userId);

    return tagsWithPosts.map((tag) => ({
      ...tag,
      posts: PostDto.fromEntities(tag.posts),
    }));
  }

  @Get('recent')
  async findRecent(
    @Req() request: Request,
    @Param('id') tagId: string,
  ): Promise<PostDto[]> {
    const { userId } = request.user;
    return PostDto.fromEntities(
      await this.postService.findUserRecentPosts(userId),
    );
  }

  @Get('tag/:id')
  async findAllByTagId(
    @Req() request: Request,
    @Param('id') tagId: string,
  ): Promise<PostDto[]> {
    const { userId } = request.user;
    return PostDto.fromEntities(
      await this.postService.findUserPostsByTagId(userId, tagId),
    );
  }

  @Get(':id')
  async findById(@Param('id') postId: string): Promise<PostDto> {
    return PostDto.fromEntity(await this.postService.findById(postId));
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body() post: CreatePostDto,
  ): Promise<PostDto> {
    const { userId } = request.user;
    const storedPost = await this.postService.create(userId, post);

    return PostDto.fromEntity(storedPost);
  }
}
