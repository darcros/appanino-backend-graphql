import { Resolver, Query, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Product } from '../../entity/product.entity';
import { ProductRepository } from './product.repository';
import { School } from '../../entity/school.entity';

@Resolver(() => Product)
export class ProductResolver {
  @InjectRepository(ProductRepository)
  private readonly productRepository: ProductRepository;

  @Query(() => [Product])
  public async products() {
    return await this.productRepository.find();
  }

  @FieldResolver(() => [School])
  public async schools(@Root() product: Product) {
    const foundProduct = await this.productRepository.findOne(product.id, { relations: ['schools'] });

    if (foundProduct) {
      return foundProduct.schools;
    }

    return [];
  }
}
