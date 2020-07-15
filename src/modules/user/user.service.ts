import * as R from 'ramda';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByCredentials(
    email: string,
    passwordHash: string,
  ): Promise<User> {
    return await this.userRepository.findOne({
      email,
      password: passwordHash,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findOneByIdAndToken(id: string, token: string): Promise<User> {
    return await this.userRepository.findOne({ id, token });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const user = await this.userRepository.create({
      email,
      password: passwordHash,
    });
    return await this.userRepository.save(user);
  }

  async saveToken(email: string, token: string): Promise<UpdateResult> {
    return await this.userRepository.update({ email }, { token });
  }

  async destroyToken(userId: string): Promise<UpdateResult> {
    const result = await this.userRepository.update(userId, { token: null });
    if (R.path(['raw', 'changedRows'], result) !== 1) {
      throw new BadRequestException(
        `Destroy token query resulted in no changes for userId: ${userId}`,
      );
    }
    return result;
  }
}
