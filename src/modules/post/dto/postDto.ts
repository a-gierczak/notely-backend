import * as R from 'ramda';
import { Tag } from 'src/modules/tag/tag.entity';
import { Post } from '../post.entity';
import { getObjectUrl } from 'src/modules/storage/storage.service';

export class PostDto {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  createdAt: Date;
  tags: Tag[];

  static fromEntity(postEntity: Post): PostDto {
    const postDto = new PostDto();
    postDto.id = postEntity.id;
    postDto.name = postEntity.name;
    postDto.description = postEntity.description;
    postDto.fileUrl = getObjectUrl(postEntity.fileName);
    postDto.createdAt = postEntity.createdAt;
    postDto.tags = postEntity.tags;

    return postDto;
  }

  static fromEntities(postEntities: Post[]): PostDto[] {
    return postEntities.map(PostDto.fromEntity);
  }
}
