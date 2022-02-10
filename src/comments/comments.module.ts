import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConmmentRepository } from './comment.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConmmentRepository]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  // exports: []
})
export class CommentsModule {}
