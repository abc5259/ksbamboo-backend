import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { Like } from '../entities/like.entity';

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async createLike(board: Board, user: User) {
    const like = await this.create({
      user,
      board,
    });
    return await this.save(like);
  }
  async deleteLike(board: Board, user: User) {
    const result = await this.delete({ board, user });
    if (result.affected === 0) {
      throw new NotFoundException('해당 좋아요를 찾을 수 없습니다.');
    }
    return true;
  }
}
