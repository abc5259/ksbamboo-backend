import { User } from 'src/auth/entities/user.entity';
import { BoardStatus } from 'src/boards/board-status.enum.';
import { Board } from 'src/boards/entities/board.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(
    board: Board,
    { content }: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = this.create({
      content,
      user,
      status: BoardStatus.PRIVATE,
      board,
    });
    await this.save(comment);
    return comment;
  }
}
