import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Verification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  //onDelete: 만약 user을 삭제하면 user와 연관된 verification도 삭제한다는 말
  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
