import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  //Notification
  @Get('notifications')
  @UseGuards(AuthGuard())
  async getAlltNotifications(@GetUser() user: User) {
    return this.userService.getAlltNotifications(user);
  }

  @Patch('notification/view')
  @UseGuards(AuthGuard())
  async updateViewNotification(
    @Query('notificationId') notificationId: number,
  ) {
    return this.userService.updateViewNotification(notificationId);
  }
}
