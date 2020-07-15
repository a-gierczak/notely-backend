import { IsNotEmpty } from 'class-validator';

export class FileMetaDto {
  @IsNotEmpty()
  contentType: string;
}
