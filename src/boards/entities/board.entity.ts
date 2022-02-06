import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Image } from 'src/image/entity/image.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardStatus } from '../board-status.enum.';
import { BoardCategoryType } from '../types/board-category.type';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: BoardStatus;

  @Column()
  category: BoardCategoryType;

  @CreateDateColumn() // entity를 만들었을때 자동으로 설정해 주는 special column
  createdAt: Date;

  @UpdateDateColumn() // entity를 update시 자동으로 설정해 주는 special column
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.boards, { eager: false })
  user: User;

  @OneToMany((type) => Comment, (comment) => comment.board)
  comments: Comment[];

  @OneToMany((type) => Image, (image) => image.board)
  images: Image[];
}
