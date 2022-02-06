import { Board } from 'src/boards/entities/board.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { KsDepartment } from '../user-ksDepartment.type';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;

  @Column()
  ksDepartment: KsDepartment;

  @Column()
  enterYear: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @CreateDateColumn() // entity를 만들었을때 자동으로 설정해 주는 special column
  createdAt: Date;

  @UpdateDateColumn() // entity를 update시 자동으로 설정해 주는 special column
  updatedAt: Date;

  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];
}
