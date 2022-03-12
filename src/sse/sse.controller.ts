import { Controller, Param, Query, Sse } from '@nestjs/common';
import { BoardCategoryType } from 'src/boards/types/board-category.type';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}
  @Sse('events')
  events(@Query() { userId }: { userId?: string }) {
    return this.sseService.newBoardSubscribe(userId);
  }

  @Sse('events/comment')
  eventsComment(@Query() { userId }: { userId: string }) {
    return this.sseService.notificationSubscribe(userId);
  }

  @Sse('events/:category')
  categoryEvents(
    @Param('category') category: BoardCategoryType,
    @Query() { userId }: { userId?: string },
  ) {
    return this.sseService.newCategoryBoardSubscribe(category, userId);
  }
}
