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
import { SseModule } from 'src/sse/sse.module';

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
    SseModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
