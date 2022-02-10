import { User } from 'src/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@EntityRepository(Comment)
export class ConmmentRepository extends Repository<Comment> {
  async createComment(
    { content }: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = this.create({
      content,
      user,
    });
    await this.save(comment);
    return comment;
  }
}
