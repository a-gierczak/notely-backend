import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  fileName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToMany((type) => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];

  @ManyToOne((type) => User, (user) => user.posts)
  user: User | string;
}
