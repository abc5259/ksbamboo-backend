import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum.';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne(id);
    if (!board) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다.`);
    }
    return board;
  }

  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  async deleteBoard(id: number) {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    return Object.assign({ ok: true });
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
}
