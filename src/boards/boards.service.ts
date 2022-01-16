import { Injectable } from '@nestjs/common';
import { Board } from './board.model';

@Injectable()
export class BoardsService {
  private boards: Board[] = []; //private를 사용하지 않으면 다른 컨포넌트에서 boards를 수정할 수 있기때문이다.

  getAllBoards(): Board[] {
    return this.boards;
  }
}
