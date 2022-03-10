import { Controller, Get, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { fromEvent } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // //Notification
  // @Get('notifications')
  // @UseGuards(AuthGuard())
  // async getAlltNotifications(@GetUser() user: User) {
  //   return this.commentsService.getAlltNotifications(user);
  // }

  //Notification Alarm
  // user 게시물의 댓글을 알림으로 줘야함
  // 댓글 단 사람이랑 해당 게시물 작성자랑 이벤트가 서로 연결되어 있어야 함
  @Sse('/notification')
  @UseGuards(AuthGuard())
  events(@GetUser() user: User) {
    return this.commentsService.notificationSubscribe(user);
  }
}
