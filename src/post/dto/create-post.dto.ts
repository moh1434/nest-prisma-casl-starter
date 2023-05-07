import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;
}
