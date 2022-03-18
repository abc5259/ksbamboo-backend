import { Comment } from 'src/comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.notifications)
  user: User;

  @OneToOne((type) => Comment, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: Comment;

  @Column('boolean', { default: false })
  isView: boolean = false;
}
