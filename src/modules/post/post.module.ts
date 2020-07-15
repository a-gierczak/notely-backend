import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TagModule } from '../tag/tag.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TagModule, UserModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
