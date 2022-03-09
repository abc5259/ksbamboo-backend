import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async createCommentNotification(boardeWriter: User, comment: Comment) {
    if (boardeWriter.id === comment.user.id) {
      return;
    }
    const notification = this.create({ user: boardeWriter, comment });
    return await this.save(notification);
  }
}
