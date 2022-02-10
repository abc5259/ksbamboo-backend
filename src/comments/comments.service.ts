import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ConmmentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(ConmmentRepository)
    private conmmentRepository: ConmmentRepository,
  ) {}
  async createComment(createCommentDto: CreateCommentDto, user: User) {
    return this.conmmentRepository.createComment(createCommentDto, user);
  }
}
