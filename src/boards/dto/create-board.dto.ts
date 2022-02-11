import { IsNotEmpty, IsString } from 'class-validator';
import { BoardCategoryType } from '../types/board-category.type';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  category: BoardCategoryType;
}
