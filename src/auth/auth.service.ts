import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.userRepository.createUser(authCredentialDto);
  }

  async login({
    username,
    password,
  }: AuthCredentialDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('비밀번호가 틀립니다.');
    }
    //유저 토큰 생성 (Secret + playload)
    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async sendMail(email: string) {
    try {
      const number = Math.floor(Math.random() * 888888 + 111111);
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: `${this.configService.get<string>('EMAIL_ID')}@naver.com`, // sender address
        subject: '이메일 인증 요청 메일입니다.', // Subject line
        html: '6자리 인증 코드 : ' + `<b>${number}</b>`, // HTML body content
      });
      return 123456;
    } catch (err) {
      console.log(err);
    }
  }
}
