import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';
import { LoginInputDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { NotificationRepository } from 'src/notification/notification.repository';
import { EventEmitter } from 'stream';
import { fromEvent } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly emitter = new EventEmitter();
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<{ ok: boolean }> {
    const user = await this.userRepository.createUser(authCredentialDto);
    try {
      const verification = await this.verification.save(
        this.verification.create({
          user,
        }),
      );
      //sendEmail
      this.sendMail(user.email, verification.code);
      return { ok: true };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginInputDto) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('비밀번호가 틀립니다.');
    }
    //이메일 인증되지 않은 사용자 에러처리
    if (!user.verified) {
      throw new UnauthorizedException('이메일 인증을 해야합니다.');
    }
    //유저 토큰 생성 (Secret + playload)
    // const payload = { email };
    // const accessToken = await this.jwtService.sign(payload);
    const { accessToken, accessOption } =
      await this.getCookieWithJwtAccessToken(email);
    const { refreshToken, refreshOption } =
      await this.getCookieWithJwtRefreshToken(email);
    await this.updateRefreshTokenInUser(refreshToken, email);
    const returnUser = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.ksDepartment',
        'user.enterYear',
        'user.verified',
      ])
      .where('user.email = :email', { email })
      .getOne();
    return {
      accessToken,
      accessOption,
      refreshToken,
      refreshOption,
      user: returnUser,
    };
  }

  async sendMail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: `${this.configService.get<string>('EMAIL_ID')}@naver.com`, // sender address
        subject: '이메일 인증 요청 메일입니다.', // Subject line
        html: `<a href="http://localhost:3050/auth/email/?code=${code}">인증하기</a>`, // HTML body content
      });
      //front로 redirect시켜주기
      return { ok: true };
    } catch (error) {
      console.log(error);
    }
  }

  async emailAuth({
    code,
  }: {
    code: string;
  }): Promise<{ ok: boolean; message: string }> {
    try {
      const verification = await this.verification.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        this.userRepository.save(verification.user);
      }
      // 이메일 인증코드 삭제 및 인증 코드 유효기간 부여하기
      return {
        ok: true,
        message: '이메일 인증이 완료되었습니다! 로그인 하여 시작해주세요',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: '이메일 인증이 실패하였습니다. 다시 시도해주세요',
      };
    }
  }

  //accessToken 전달
  async getCookieWithJwtAccessToken(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      accessToken: token,
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge:
          Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) *
          1000,
      },
    };
  }

  //refreshToken 전달
  async getCookieWithJwtRefreshToken(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME', // 일주일
      )}s`,
    });
    return {
      refreshToken: token,
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge:
          Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
          1000,
      },
    };
  }

  // RefreshToken 암호화 and 저장
  async updateRefreshTokenInUser(refreshToken: string, email: string) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }
    await this.userRepository.update(
      { email },
      {
        currentHashedRefreshToken: refreshToken,
      },
    );
  }

  // RefreshToken이 유효한지 확인
  async getUserRefreshTokenMatches(
    refreshToken: string,
    email: string,
  ): Promise<{ result: boolean }> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const isRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatch) {
      // await this.updateRefreshTokenInUser(null, email);
      return { result: true };
    } else {
      throw new UnauthorizedException();
    }
  }

  async removeRefreshToken(email: string) {
    return this.userRepository.update(
      { email },
      {
        currentHashedRefreshToken: null,
      },
    );
  }

  async logOut(email: string) {
    await this.removeRefreshToken(email);
  }

  async getNewAccessAndRefreshToken(email: string) {
    const { refreshToken } = await this.getCookieWithJwtRefreshToken(email);
    await this.updateRefreshTokenInUser(refreshToken, email);
    return {
      accessToken: await this.getCookieWithJwtAccessToken(email),
      refreshToken,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

  //Notification
  async getAlltNotifications(user: User) {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .addSelect(['user.id'])
      .leftJoinAndSelect('notification.comment', 'comment')
      .leftJoin('comment.user', 'commentUser')
      .addSelect([
        'commentUser.id',
        'commentUser.ksDepartment',
        'commentUser.enterYear',
      ])
      .leftJoinAndSelect('comment.board', 'commentBoard')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('notification', 'DESC')
      .getMany();

    return notifications;
  }

  async updateViewNotification(notificationId: number) {
    const notification = await this.notificationRepository.findOne(
      notificationId,
    );
    if (!notification) {
      throw new NotFoundException('해당 알림을 찾을 수 없습니다.');
    }
    notification.isView = true;
    return await this.notificationRepository.save(notification);
  }
}
