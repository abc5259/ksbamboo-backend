import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './repository/board.repository';
import { Board } from './entities/board.entity';
import { User } from 'src/auth/entities/user.entity';
import { BoardCategoryType } from './types/board-category.type';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CommentRepository } from 'src/comments/comment.repository';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { LikeRepository } from './repository/like.repository';
import { FavoriteRepository } from './repository/favorite.repository';
import { SseService } from 'src/sse/sse.service';
import { Like } from './entities/like.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,
    @InjectRepository(FavoriteRepository)
    private favoriteRepository: FavoriteRepository,
    private readonly sseService: SseService,
  ) {}

  async getAllBoards(boardId?: number) {
    if (!boardId) {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.user', 'user')
        .addSelect([
          'user.id',
          'user.username',
          'user.email',
          'user.ksDepartment',
          'user.enterYear',
          'user.verified',
        ])
        .leftJoin('board.comments', 'comment')
        .addSelect(['comment.id'])
        .leftJoin('board.likes', 'likes')
        .addSelect(['likes.id'])
        .take(10)
        .orderBy('board.createdAt', 'DESC')
        .getMany();
    } else {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.user', 'user')
        .addSelect([
          'user.id',
          'user.username',
          'user.email',
          'user.ksDepartment',
          'user.enterYear',
          'user.verified',
        ])
        .leftJoin('board.comments', 'comment')
        .addSelect(['comment.id'])
        .leftJoin('board.likes', 'likes')
        .addSelect(['likes.id'])
        .where('board.id < :boardId', { boardId })
        .take(10)
        .orderBy('board.createdAt', 'DESC')
        .getMany();
    }
  }

  async getMeBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });
    const boards = await query.getMany();
    return boards;
  }

  async getCategoryBoards(
    category: BoardCategoryType,
    boardId?: number,
  ): Promise<Board[]> {
    if (!boardId) {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.user', 'user')
        .addSelect([
          'user.id',
          'user.username',
          'user.email',
          'user.ksDepartment',
          'user.enterYear',
          'user.verified',
        ])
        .leftJoin('board.comments', 'comment')
        .addSelect(['comment.id'])
        .leftJoin('board.likes', 'likes')
        .addSelect(['likes.id'])
        .where('board.category = :category', { category })
        .take(10)
        .orderBy('board.createdAt', 'DESC')
        .getMany();
    }
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .leftJoin('board.comments', 'comment')
      .addSelect(['comment.id'])
      .leftJoin('board.likes', 'likes')
      .addSelect(['likes.id'])
      .where('board.category = :category', { category })
      .andWhere('board.id < :boardId', { boardId })
      .take(10)
      .orderBy('board.createdAt', 'DESC')
      .getMany();
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .leftJoinAndSelect('board.comments', 'comments')
      .leftJoin('comments.user', 'commentsUser')
      .addSelect([
        'commentsUser.id',
        'commentsUser.username',
        'commentsUser.email',
        'commentsUser.ksDepartment',
        'commentsUser.enterYear',
        'commentsUser.verified',
      ])
      .leftJoinAndSelect('board.likes', 'likes')
      .leftJoin('likes.user', 'likesUser')
      .addSelect(['likesUser.id'])
      .leftJoinAndSelect('board.favorites', 'favorites')
      .leftJoin('favorites.user', 'favoritesUser')
      .addSelect(['favoritesUser.id'])
      .where('board.id = :boardId', { boardId: id })
      .orderBy('comments', 'ASC')
      .getOne();
    if (!board) {
      throw new NotFoundException(`?????? ???????????? ?????? ??? ????????????.`);
    }
    return board;
  }

  async getLikeAllBoards(boardId?: number) {
    if (!boardId) {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.user', 'user')
        .addSelect([
          'user.id',
          'user.username',
          'user.email',
          'user.ksDepartment',
          'user.enterYear',
          'user.verified',
        ])
        .leftJoin('board.comments', 'comment')
        .addSelect(['comment.id'])
        .leftJoin('board.likes', 'likes')
        .addSelect(['likes.id'])
        .loadRelationCountAndMap('board.likesCount', 'board.likes')
        // .orderBy('board.likesCount', 'DESC')
        .take(10)
        .getMany();
    } else {
      return await this.boardRepository
        .createQueryBuilder('board')
        .leftJoin('board.user', 'user')
        .addSelect([
          'user.id',
          'user.username',
          'user.email',
          'user.ksDepartment',
          'user.enterYear',
          'user.verified',
        ])
        .leftJoin('board.comments', 'comment')
        .addSelect(['comment.id'])
        .leftJoin('board.likes', 'likes')
        .addSelect(['likes.id'])
        .where('board.id < :boardId', { boardId })
        .take(10)
        .loadRelationCountAndMap('likes', 'likeCount')
        .from(Like, 'likeCount')
        .orderBy('likeCount', 'DESC')
        .getMany();
    }
  }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    if (createBoardDto.category === '??????') {
      this.sseService.newBoardEmit(createBoardDto.category, user.id);
    } else {
      this.sseService.newCategoryBoardEmit(createBoardDto.category, user.id);
    }
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async deleteBoard(id: number, user: User): Promise<{ ok: boolean }> {
    const result = await this.boardRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????.');
    }
    return { ok: true };
  }

  async updateBoard(
    id: number,
    { content, title }: UpdateBoardDto,
    user: User,
  ): Promise<Board> {
    const board = await this.boardRepository.findOne({ id, user });
    if (!board) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????.');
    }
    if (title) {
      board.title = title;
    }
    if (content) {
      board.content = content;
    }
    await this.boardRepository.save(board);
    return board;
  }
  //comment
  async createBoardComment(
    boardId: number,
    createCommentDto: CreateCommentDto,
    user: User,
  ) {
    const board = await this.boardRepository.findOne(boardId);
    if (!board) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????.');
    }
    const comment = await this.commentRepository.createComment(
      board,
      createCommentDto,
      user,
    );
    const boardeWriter = await this.getBoardWriter(boardId);
    if (user.id !== boardeWriter.id) {
      this.sseService.notificationEmit(
        `notification/${boardeWriter.id}`,
        '????????? ??????',
      );
    }
    return comment;
  }

  async getBoardWriter(boardId: number) {
    return (
      await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect('board.user', 'user')
        .where('board.id = :boardId', { boardId })
        .getOne()
    ).user;
  }

  async deleteBoardComment(
    boardId: number,
    commentId: number,
    user: User,
  ): Promise<{ ok: boolean }> {
    const board = await this.boardRepository.findOne(boardId);
    if (!board) {
      throw new NotFoundException('?????? ???????????? ?????? ??? ????????????.');
    }
    const result = await this.commentRepository.delete({
      id: commentId,
      user,
      board,
    });
    if (result.affected === 0) {
      throw new NotFoundException('?????? ????????? ?????? ??? ????????????.');
    }
    return { ok: true };
  }

  async updateBoardComment(
    boardId: number,
    commentId: number,
    { content }: UpdateCommentDto,
    user: User,
  ) {
    await this.getBoardById(boardId);
    const comment = await this.commentRepository.findOne({
      id: commentId,
      user,
    });
    if (!comment) {
      throw new NotFoundException('?????? ????????? ?????? ??? ????????????.');
    }
    comment.content = content;
    return await this.commentRepository.save(comment);
  }

  async updateBoardLikes(boardId: number, user: User) {
    const board = await this.boardRepository.findOne(boardId);
    const boardLike = await this.likeRepository.findOne({ user, board });
    // ?????? ???????????? ????????? ??????
    if (boardLike) {
      return this.likeRepository.deleteLike(board, user);
    }
    // ???????????? ????????? ???????????? create
    await this.likeRepository.createLike(board, user);
    return await this.getBoardById(boardId);
  }

  //user
  async getLoginUserBoards(user: User) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .leftJoin('board.comments', 'comment')
      .addSelect(['comment.id'])
      .leftJoin('board.likes', 'likes')
      .addSelect(['likes.id'])
      .orderBy('board.createdAt', 'DESC')
      .where('board.user.id = :userId', { userId: user.id })
      .getMany();
  }

  async getLoginUserCommentBoards(user: User) {
    // board?????? ???????????? comments??? ??????
    // comment?????? ????????? user??? ??????.
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .leftJoinAndSelect('board.comments', 'comments')
      .leftJoin('comments.user', 'commentsUser')
      .addSelect([
        'commentsUser.id',
        'commentsUser.username',
        'commentsUser.email',
        'commentsUser.ksDepartment',
        'commentsUser.enterYear',
        'commentsUser.verified',
      ])
      .leftJoinAndSelect('board.likes', 'likes')
      .leftJoin('likes.user', 'likesUser')
      .addSelect(['likesUser.id'])
      .where('commentsUser.email = :userEmail', { userEmail: user.email })
      .getMany();
  }

  //BoardFavorite + 1
  async updateBoardFavorites(boardId: number, user: User) {
    const board = await this.boardRepository.findOne(boardId);
    const isBoardFavorite = await this.favoriteRepository.findOne({
      board,
      user,
    });
    //?????? ???????????? ????????? ??????
    if (isBoardFavorite) {
      return this.favoriteRepository.deleteFavorite(board, user);
    }
    await this.favoriteRepository.createFarvorite(user, board);
    return this.getBoardById(boardId);
  }

  async getMyFovoriteBoards(user: User) {
    return await this.boardRepository
      .createQueryBuilder('board')
      .leftJoin('board.user', 'user')
      .addSelect([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .leftJoinAndSelect('board.comments', 'comments')
      .leftJoin('comments.user', 'commentsUser')
      .addSelect(['commentsUser.id'])
      .leftJoinAndSelect('board.likes', 'likes')
      .leftJoin('likes.user', 'likesUser')
      .addSelect(['likesUser.id'])
      .leftJoinAndSelect('board.favorites', 'favorites')
      .leftJoin('favorites.user', 'favoritesUser')
      .addSelect(['favoritesUser.id'])
      .where('favoritesUser.id = :userId', { userId: user.id })
      .getMany();
  }
}
