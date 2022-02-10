import { User } from 'src/auth/entities/user.entity';
import { BoardStatus } from 'src/boards/board-status.enum.';
import { Board } from 'src/boards/entities/board.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  status: BoardStatus;

  @CreateDateColumn() // entity를 만들었을때 자동으로 설정해 주는 special column
  createdAt: Date;

  @UpdateDateColumn() // entity를 update시 자동으로 설정해 주는 special column
  updatedAt: Date;

  //User에 속해있음 일대다
  @ManyToOne((type) => User, (user) => user.comments)
  user: User;

  //Post에 속해있음 일대다
  @ManyToOne((type) => Board, (board) => board.comments)
  board: Board;
}
