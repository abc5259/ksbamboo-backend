import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { KsDepartment } from '../user-ksDepartment.type';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  ksDepartment: KsDepartment;

  @Column()
  enterYear: string;

  @Column({ default: false })
  verified: boolean;

  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];
}
