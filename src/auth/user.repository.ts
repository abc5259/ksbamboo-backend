import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser({
    username,
    password,
    email,
  }: AuthCredentialDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.save(
        this.create({
          username,
          email,
          password: hashedPassword,
        }),
      );
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 email입니다.');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
