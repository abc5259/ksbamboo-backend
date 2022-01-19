import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser({ username, password }: AuthCredentialDto): Promise<User> {
    const user = this.create({
      username,
      password,
    });
    await this.save(user);
    return user;
  }
}
