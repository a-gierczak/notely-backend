import { PostDto } from 'src/modules/post/dto/postDto';
import { Tag } from '../tag.entity';

export class TagDto {
  id: string;
  name: string;
  posts?: PostDto[];

  static fromEntity(tag: Tag) {
    const dto = new TagDto();
    dto.id = tag.id;
    dto.name = tag.name;
    if (tag.posts) {
      dto.posts = PostDto.fromEntities(tag.posts);
    }
    return dto;
  }

  static fromEntities(tagEntities: Tag[]): TagDto[] {
    return tagEntities.map(TagDto.fromEntity);
  }
}
