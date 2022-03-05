import { EntityRepository, Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

@EntityRepository(Favorite)
export class FavoriteRepository extends Repository<Favorite> {}
