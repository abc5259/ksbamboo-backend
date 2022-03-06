import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { Favorite } from '../entities/favorite.entity';

@EntityRepository(Favorite)
export class FavoriteRepository extends Repository<Favorite> {
  async createFarvorite(user: User, board: Board) {
    const favorite = this.create({ user, board });
    return await this.save(favorite);
  }
  async deleteFavorite(board: Board, user: User) {
    const result = await this.delete({ board, user });
    if (result.affected === 0) {
      throw new NotFoundException('해당 스크랩을 찾을 수 없습니다.');
    }
    return true;
  }
}
