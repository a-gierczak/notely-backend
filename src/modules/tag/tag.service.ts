import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, Like } from 'typeorm';
import { Tag } from './tag.entity';
import * as R from 'ramda';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(userId: string): Promise<Tag[]> {
    return await this.tagRepository.find({ where: { userId } });
  }

  async create(tag: Tag): Promise<Tag> {
    return await this.tagRepository.save(tag);
  }

  async createNewTags(
    userId: string,
    tags: DeepPartial<Tag[]>,
  ): Promise<Tag[]> {
    const existingTags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.user = :userId', { userId })
      .getMany();

    const newTags = R.differenceWith<DeepPartial<Tag>>(
      R.eqProps('name'),
      tags,
      existingTags,
    );
    const allTags = R.union<Tag>(
      (await this.tagRepository.save(newTags)) as Tag[],
      existingTags,
    );
    return R.map<DeepPartial<Tag>, Tag>(
      (tag) => R.find<Tag>(R.propEq('name', tag.name), allTags),
      tags,
    );
  }

  async findUserPosts(userId: string): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.posts', 'post')
      .where('tag.userId = :userId', { userId })
      .getMany();
  }

  async search(userId: string, query: string): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { name: Like(`%${query}%`), userId },
      take: 10,
    });
  }
}
