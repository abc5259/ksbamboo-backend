import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Sse,
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
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Controller('boards')
export class BoardsController {
  private logger = new Logger('BoardController');
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(@Query() { nextBoardId }: { nextBoardId?: number }) {
    return this.boardsService.getAllBoards(nextBoardId);
  }

  @Get('like')
  getLikeAllBoards(@Query() { nextBoardId }: { nextBoardId?: number }) {
    return this.boardsService.getLikeAllBoards(nextBoardId);
  }

  @Get('/category/:category')
  getCategoryBoards(
    @Param('category') category: BoardCategoryType,
    @Query() { nextBoardId }: { nextBoardId?: number },
  ): Promise<Board[]> {
    return this.boardsService.getCategoryBoards(category, nextBoardId);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getLoginUserBoards(@GetUser() user: User) {
    console.log(user);
    return this.boardsService.getLoginUserBoards(user);
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

  @Delete('/:boardId/comment/:commentId')
  @UseGuards(AuthGuard())
  deleteBoardComment(
    @Param() { boardId, commentId }: { boardId: number; commentId: number },
    @GetUser() user: User,
  ) {
    return this.boardsService.deleteBoardComment(boardId, commentId, user);
  }

  @Patch('/:boardId/comment/:commentId')
  @UseGuards(AuthGuard())
  updateBoardComment(
    @Param() { boardId, commentId }: { boardId: number; commentId: number },
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoardComment(
      boardId,
      commentId,
      updateCommentDto,
      user,
    );
  }

  //like
  @Patch('/:boardId/like')
  @UseGuards(AuthGuard())
  updateBoardLikes(
    @Param() { boardId }: { boardId: number },
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoardLikes(boardId, user);
  }

  //user
  @Get('/me/comment')
  @UseGuards(AuthGuard())
  getLoginUserCommentBoards(@GetUser() user: User) {
    return this.boardsService.getLoginUserCommentBoards(user);
  }

  //favorite
  @Patch('/:boardId/favorite')
  @UseGuards(AuthGuard())
  updateBoardFavorites(
    @Param() { boardId }: { boardId: number },
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoardFavorites(boardId, user);
  }

  @Get('/me/favorite')
  @UseGuards(AuthGuard())
  getMyFovoriteBoards(@GetUser() user: User) {
    return this.boardsService.getMyFovoriteBoards(user);
  }
}
