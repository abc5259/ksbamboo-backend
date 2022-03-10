import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentRepository } from 'src/comments/comment.repository';
import { BoardRepository } from './repository/board.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { LikeRepository } from './repository/like.repository';
import { FavoriteRepository } from './repository/favorite.repository';
import { NotificationRepository } from 'src/notification/notification.repository';
import { CommentsService } from 'src/comments/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardRepository,
      CommentRepository,
      LikeRepository,
      FavoriteRepository,
      NotificationRepository,
    ]),
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, CommentsService],
})
export class BoardsModule {}
