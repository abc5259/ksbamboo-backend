import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<User> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }

  @Get('/email/:code')
  async sendMail(@Param('code') code: string) {
    return this.authService.sendMail(code);
  }

  @Get('/test')
  async emailAuth(@Query() emailAuthDto: { email: string; code: string }) {
    return this.authService.emailAuth(emailAuthDto);
  }
}
