import * as R from 'ramda';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, MoreThanOrEqual } from 'typeorm';
import { Post } from './post.entity';
import { Tag } from '../tag/tag.entity';
import { CreatePostDto } from './dto/createPostDto';
import { TagService } from '../tag/tag.service';
import { subHours } from 'date-fns';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly tagService: TagService,
  ) {}

  async findUserPosts(userId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['tags'],
    });
  }

  async findUserRecentPosts(userId: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: {
        user: { id: userId },
        createdAt: MoreThanOrEqual(subHours(new Date(), 24)),
      },
      relations: ['tags'],
    });
  }

  async create(userId: string, post: CreatePostDto): Promise<Post> {
    const tagEntities = await R.pipe(
      R.map<string, DeepPartial<Tag>>((tagName) => ({
        name: tagName,
        user: userId,
      })),
      (entities: DeepPartial<Tag>[]) => this.tagRepository.create(entities),
    )(post.tags);
    const tags = await this.tagService.createNewTags(userId, tagEntities);

    const postEntity = {
      ...post,
      tags,
      user: userId,
    };

    return await this.postRepository.save(postEntity);
  }

  async findUserPostsByTagId(userId: string, tagId: string): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.tags', 'tag')
      .where('tag.id = :tagId AND post.userId = :userId', { tagId, userId })
      .getMany();

    return await this.postRepository.find({
      where: R.map(R.pick(['id']), posts),
      relations: ['tags'],
    });
  }

  async findById(id: string): Promise<Post> {
    return await this.postRepository.findOne({ id }, { relations: ['tags'] });
  }
}
