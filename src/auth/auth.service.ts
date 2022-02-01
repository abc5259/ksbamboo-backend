import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    const user = await this.userRepository.createUser(authCredentialDto);
    const verification = await this.verification.save(
      this.verification.create({
        user,
      }),
    );
    //sendEmail
    this.sendMail(user.email, verification.code);
    return user;
  }

  async login({
    email,
    password,
  }: AuthCredentialDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('비밀번호가 틀립니다.');
    }
    //유저 토큰 생성 (Secret + playload)
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async sendMail(email: string, code: string) {
    try {
      // const verification = await this.verification.findOne(
      //   { code },
      //   { relations: ['user'] },
      // );
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: `${this.configService.get<string>('EMAIL_ID')}@naver.com`, // sender address
        subject: '이메일 인증 요청 메일입니다.', // Subject line
        html: `<a href="http://localhost:3050/auth/email/?code=${code}">인증하기</a>`, // HTML body content
      });
      //front로 redirect시켜주기
      return { ok: true };
    } catch (err) {
      console.log(err);
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
      // 프론트 서버 페이지로 redirect
      return {
        ok: true,
        message: '이메일 인증이 완료되었습니다! 로그인 하여 시작해주새요',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: '이메일 인증이 실패하였습니다. 다시 시도해주세요',
      };
    }
  }
}
