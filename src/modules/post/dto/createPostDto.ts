import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  name: string;

  description?: string;

  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  tags: string[];
}
