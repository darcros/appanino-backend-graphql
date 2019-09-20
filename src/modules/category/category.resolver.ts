import { Resolver, Query, Authorized } from 'type-graphql';
import { Category } from '../../entity/category.entity';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CategoryRepository } from './category.repository';
import { ProductRepository } from '../product/product.repository';
import { Role } from '../../entity/user.entity';

@Resolver(() => Category)
export class CategoryResolver {
  @InjectRepository(CategoryRepository)
  private readonly categoryRepository: CategoryRepository;
  @InjectRepository(ProductRepository)
  private readonly productRepository: ProductRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Query(() => [Category])
  public async categories() {
    return this.categoryRepository.find();
  }
}
