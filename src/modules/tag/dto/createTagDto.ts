import { IsNotEmpty, IsAlpha } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsAlpha()
  name: string;
}
