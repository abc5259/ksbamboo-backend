import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum.';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    { title, content }: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = this.create({
      title,
      content,
      status: BoardStatus.PUBLIC,
      user,
    });
    await this.save(board);
    return board;
  }
}
