import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Refresh;
        },
      ]),
    });
  }

  async validate(req, { email }) {
    const refreshToken = req.cookies?.Refresh;
    await this.authService.getUserRefreshTokenMatches(refreshToken, email);
    const user: User = await this.userRepository.findOne(
      { email },
      { select: ['id', 'ksDepartment', 'verified', 'username', 'email'] },
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
