import {
  Entity,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany((type) => Post, (post) => post.tags)
  posts: Post[];

  @ManyToOne((type) => User)
  @JoinColumn()
  user: User | string;
}
