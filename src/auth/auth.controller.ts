import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './entities/user.entity';
import { LoginInputDto } from './dto/login-user.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/join')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<{ ok: boolean }> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) loginInputDto: LoginInputDto,
  ) {
    const { accessToken, accessOption, refreshToken, refreshOption, user } =
      await this.authService.login(loginInputDto);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return user;
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  getUser(@GetUser() user: User) {
    return user;
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
    // @Body() { refresh_token }: { refresh_token: string },
  ) {
    // const { result } = await this.authService.getUserRefreshTokenMatches(
    //   refresh_token,
    //   user.email,
    // );
    if (user) {
      const { accessToken, accessOption } =
        await this.authService.getCookieWithJwtAccessToken(user.email);
      res.cookie('Authentication', accessToken, accessOption);
      return { accessToken };
    }
  }

  // @Get('/email/:code')
  // async sendMail(@Param('code') code: string) {
  //   return this.authService.sendMail(code);
  // }

  @Get('/email')
  @Redirect('http://localhost:3000', 302)
  async emailAuth(
    @Query() emailAuthDto: { code: string },
  ): Promise<{ url: string }> {
    const { ok, message } = await this.authService.emailAuth(emailAuthDto);
    if (ok) {
      return { url: `http://localhost:3000/login?message=${message}` };
    } else {
      return { url: `http://localhost:3000/join?message=${message}` };
    }
  }
}
