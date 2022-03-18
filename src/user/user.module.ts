import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRepository } from 'src/notification/notification.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
