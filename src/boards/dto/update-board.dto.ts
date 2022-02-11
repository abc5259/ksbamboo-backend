import { IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
