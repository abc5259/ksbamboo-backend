import { User } from 'src/auth/entities/user.entity';
import { Board } from 'src/boards/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  //User에 속해있음 일대다
  @ManyToOne((type) => User, (user) => user.comments)
  user: User;

  //Post에 속해있음 일대다
  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;
}
