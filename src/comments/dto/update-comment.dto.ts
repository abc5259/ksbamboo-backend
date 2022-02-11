import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content: string;
}
