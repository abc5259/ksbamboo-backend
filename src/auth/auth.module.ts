import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Verification } from './entities/verification.entity';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { NotificationRepository } from '../notification/notification.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${config.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          )}s`,
        }, //expiresIn: 10
      }),
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      Verification,
      NotificationRepository,
    ]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get<string>('EMIAL_SERVICE'),
          host: config.get<string>('EMAIL_HOST'),
          port: config.get<number>('EMIAL_PORT'),
          auth: {
            user: config.get<string>('EMAIL_ID'), // generated ethereal user
            pass: config.get<string>('EMAIL_PASSWORD'), // generated ethereal password
          },
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [JwtStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {}
