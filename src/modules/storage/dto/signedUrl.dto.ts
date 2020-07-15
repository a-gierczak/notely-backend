import { IsNotEmpty } from 'class-validator';

export class SignedUrlDto {
  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  url: string;
}
