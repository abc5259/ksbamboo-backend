import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Board } from './entities/board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardCategoryType } from './types/board-category.type';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  private logger = new Logger('BoardController');
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMeBoards(@GetUser() user: User) {
    this.logger.verbose(`User: ${user.username} trying to get all Boards`);
    return this.boardsService.getMeBoards(user);
  }

  @Get('/category/:category')
  getCategoryBoards(
    @Param('category') category: BoardCategoryType,
  ): Promise<Board[]> {
    return this.boardsService.getCategoryBoards(category);
  }

  @Get('/:id')
  getBoard(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User: ${user.username} creating a new board. payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteBoard(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ ok: boolean }> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  updateBoard(
    @Param('id') id,
    @Body() updateBoardDto: UpdateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, updateBoardDto, user);
  }

  //comment
  @Post('/:boardId/comment')
  @UseGuards(AuthGuard())
  createBoardComment(
    @Param('boardId') boardId,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.boardsService.createBoardComment(
      boardId,
      createCommentDto,
      user,
    );
  }

  @Delete(`/:boardId/comment/:commentId`)
  @UseGuards(AuthGuard())
  deleteBoardComment(
    @Param() { boardId, commentId }: { boardId: number; commentId: number },
    @GetUser() user: User,
  ) {
    return this.boardsService.deleteBoardComment(boardId, commentId, user);
  }
}
