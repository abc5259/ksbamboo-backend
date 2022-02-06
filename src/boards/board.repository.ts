import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum.';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    { title, content, category }: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = this.create({
      title,
      content,
      category,
      status: BoardStatus.PRIVATE,
      user,
    });
    await this.save(board);
    return board;
  }
}
