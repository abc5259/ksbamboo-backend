import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';
import { BoardCategoryType } from 'src/boards/types/board-category.type';

@Injectable()
export class SseService {
  private readonly emitter = new EventEmitter();
  constructor() {}

  notificationSubscribe(userId: string) {
    console.log(`notification/${userId}`);
    return fromEvent(this.emitter, `notification/${userId}`);
  }

  notificationEmit(eventName: string, data) {
    console.log(this.emitter.eventNames());
    console.log(eventName, data);
    this.emitter.emit(eventName, { data });
  }

  newBoardSubscribe(userId?: string) {
    if (userId) {
      return fromEvent(this.emitter, `newBoard/${userId}`);
    }
    return fromEvent(this.emitter, `newBoard`);
  }

  newCategoryBoardSubscribe(category: BoardCategoryType, userId?: string) {
    if (userId) {
      return fromEvent(this.emitter, `newBoard/${category}/${userId}`);
    }
    return fromEvent(this.emitter, `newBoard/${category}`);
  }

  async newBoardNotificationEmit(eventName: string, data) {
    console.log(eventName);
    return this.emitter.emit(eventName, { data });
  }

  newBoardEmit(category: BoardCategoryType, userId: number) {
    return this.emitter
      .eventNames()
      .filter((eventName) => {
        if (typeof eventName === 'string') {
          if (
            (!eventName.includes(`${category}`) &&
              !eventName.includes(`newBoard`)) ||
            eventName === `newBoard/${userId}`
          ) {
            return false;
          }
          return true;
        }
      })
      .map((eventName) =>
        this.newBoardNotificationEmit(eventName as string, '새로운 게시글'),
      );
  }

  async newCategoryBoardEmit(category: BoardCategoryType, userId: number) {
    return this.emitter
      .eventNames()
      .filter((eventName) => {
        if (typeof eventName === 'string') {
          if (
            (!eventName.includes(`${category}`) &&
              !eventName.includes(`newBoard`)) ||
            eventName === `newBoard/${category}/${userId}`
          ) {
            return false;
          }
          return true;
        }
      })
      .map((eventName) =>
        this.newBoardNotificationEmit(eventName as string, '새로운 게시글'),
      );
  }
}
