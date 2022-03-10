import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { EventEmitter } from 'events';
import { User } from 'src/auth/entities/user.entity';
import { fromEvent } from 'rxjs';

@Injectable()
export class CommentsService {
  private readonly emitter = new EventEmitter();
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  notificationSubscribe(userId: string) {
    console.log(`notification/${userId}`);
    return fromEvent(this.emitter, 'eventName');
  }

  notificationEmit(eventName: string, data) {
    console.log(this.emitter.eventNames());
    console.log(eventName, data);
    this.emitter.emit('eventName', { data });
  }
}
