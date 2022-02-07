import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
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
  login(
    @Body(ValidationPipe) loginInputDto: LoginInputDto,
  ): Promise<{ accessToken: string; user: User }> {
    return this.authService.login(loginInputDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  getUser(@GetUser() user: User) {
    return user;
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(
    @GetUser() user: User,
    @Body() { refresh_token }: { refresh_token: string },
  ) {
    const { result } = await this.authService.getUserRefreshTokenMatches(
      refresh_token,
      user.email,
    );
    if (result) {
      const { accessToken } = await this.authService.getJwtAccessToken(
        user.email,
      );
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
