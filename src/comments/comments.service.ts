import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { EventEmitter } from 'stream';
import { User } from 'src/auth/entities/user.entity';
import { fromEvent } from 'rxjs';
@Injectable()
export class CommentsService {
  private readonly emitter = new EventEmitter();
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  notificationSubscribe(user: User) {
    return fromEvent(this.emitter, `notification/${user.id}`);
  }
  newCommentNotificationEmit() {}

  notificationEmit(eventName: string, data) {
    return this.emitter.emit(eventName, { data });
  }
}
