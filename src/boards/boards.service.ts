import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum.';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './entities/board.entity';
import { User } from 'src/auth/entities/user.entity';
import { BoardCategoryType } from './types/board-category.type';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CommentRepository } from 'src/comments/comment.repository';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
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
      .getMany();
  }

  async getMeBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });
    const boards = await query.getMany();
    return boards;
  }

  async getCategoryBoards(category: BoardCategoryType): Promise<Board[]> {
    const boards = await this.boardRepository
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
      .where('board.category = :category', { category })
      .getMany();
    return boards;
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
      .where('board.id = :boardId', { boardId: id })
      .getOne();
    if (!board) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다.`);
    }
    return board;
  }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async deleteBoard(id: number, user: User): Promise<{ ok: boolean }> {
    const result = await this.boardRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    return { ok: true };
  }

  async updateBoard(
    id: number,
    { content, title }: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.getBoardById(id);
    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
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
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    return this.commentRepository.createComment(board, createCommentDto, user);
  }
}
