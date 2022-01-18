import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT, //postgres기본 포트가 5432이다.
  username: process.env.DB_USERNAME, //postgres유저명을 적어준다.
  password: process.env.DB_PASSWORD, //만든 데이터베이스의 비번을 적어준다
  database: process.env.DB_NAME, //만든 데이터베이스 이름을 적어준다.
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, //데이터베이스를 너의 모듈의 현재 상태로 마이크래이션한다는 뜻
};
