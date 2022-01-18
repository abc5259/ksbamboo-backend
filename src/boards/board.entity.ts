import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BoardStatus } from './board-status.enum.';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: BoardStatus;
}
