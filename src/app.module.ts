import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { CommentsModule } from './comments/comments.module';
import { ImageModule } from './image/image.module';
import { User } from './auth/entities/user.entity';
import { Board } from './boards/entities/board.entity';
import { Comment } from './comments/entities/comment.entity';
import { Image } from './image/entity/image.entity';
import { Verification } from './auth/entities/verification.entity';
import { Like } from './boards/entities/like.entity';
import { Favorite } from './boards/entities/favorite.entity';
import { Notification } from './notification/notification.entity';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //우리 어플리케이션의 어디서나 config 모듈에 접근할 수 있다는 것
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', //서버에 deply 할 때 환경변수 파일을 사용하지 않는다는 것
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        // DB
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, //postgres기본 포트가 5432이다.
      username: process.env.DB_USERNAME, //postgres유저명을 적어준다.
      password: process.env.DB_PASSWORD, //만든 데이터베이스의 비번을 적어준다
      database: process.env.DB_NAME, //만든 데이터베이스 이름을 적어준다.
      synchronize: true, //데이터베이스를 너의 모듈의 현재 상태로 마이크래이션한다는 뜻
      entities: [
        User,
        Board,
        Comment,
        Image,
        Verification,
        Like,
        Favorite,
        Notification,
      ],
    }),
    BoardsModule,
    AuthModule,
    CommentsModule,
    ImageModule,
    SseModule,
  ],
})
export class AppModule {}
