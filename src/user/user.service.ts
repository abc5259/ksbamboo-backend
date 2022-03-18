import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { NotificationRepository } from 'src/notification/notification.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  //Notification
  async getAlltNotifications(user: User) {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .addSelect(['user.id'])
      .leftJoinAndSelect('notification.comment', 'comment')
      .leftJoin('comment.user', 'commentUser')
      .addSelect([
        'commentUser.id',
        'commentUser.ksDepartment',
        'commentUser.enterYear',
      ])
      .leftJoinAndSelect('comment.board', 'commentBoard')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('notification', 'DESC')
      .getMany();

    return notifications;
  }

  async updateViewNotification(notificationId: number) {
    const notification = await this.notificationRepository.findOne(
      notificationId,
    );
    if (!notification) {
      throw new NotFoundException('해당 알림을 찾을 수 없습니다.');
    }
    notification.isView = true;
    return await this.notificationRepository.save(notification);
  }
}
