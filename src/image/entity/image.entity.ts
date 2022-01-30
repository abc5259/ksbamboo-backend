import { User } from 'src/auth/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @ManyToOne((type) => Board, (board) => board.images)
  board: Board;
}
