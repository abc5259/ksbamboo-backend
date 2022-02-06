import { IsNotEmpty } from 'class-validator';
import { BoardCategoryType } from '../types/board-category.type';

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: BoardCategoryType;
}
