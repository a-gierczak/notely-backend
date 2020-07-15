import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  token?: string;

  @OneToMany((type) => Post, (post) => post.user)
  @JoinTable()
  posts: Post[];

  @OneToMany((type) => Tag, (tag) => tag.user)
  @JoinTable()
  tags: Tag[];
}
