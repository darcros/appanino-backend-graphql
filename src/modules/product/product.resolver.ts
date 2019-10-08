import { Resolver, Query, Authorized, Mutation, Arg, ID } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Product } from '../../entity/product.entity';
import { ProductRepository } from './product.repository';
import { Role } from '../../entity/user.entity';
import { SchoolRepository } from '../school/school.repository';
import { NewProductInput } from './newProduct.input';

@Resolver(() => Product)
export class ProductResolver {
  @InjectRepository(ProductRepository)
  private readonly productRepository: ProductRepository;
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;

  @Query(() => [Product], { description: 'Returns all products' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async products() {
    return await this.productRepository.find();
  }

  @Query(() => Product, { nullable: true, description: 'Returns a product given its ID' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async product(@Arg('id', () => ID) id: number) {
    return await this.productRepository.findOne(id);
  }

  @Mutation(() => Product, { description: 'Creates a new product' })
  @Authorized(Role.Admin, Role.SchoolAdmin)
  public async addProduct(@Arg('newProductData') newProductData: NewProductInput) {
    const { name, price, schoolIds, categoryId } = newProductData;
    const schools = await this.schoolRepository.findByIds(schoolIds);

    if (schools.length !== schoolIds.length) {
      const foundIds = schools.map(s => s.id.toString());
      const missingIds = schoolIds.map(id => id.toString()).filter(id => !foundIds.includes(id));

      throw new Error(`Cannot find Schools with the following IDs: [${missingIds.map(n => `"${n}"`).join(', ')}]`);
    }

    const newProduct = this.productRepository.create({
      name,
      price,
      schools,
      categoryId,
    });
    return this.productRepository.save(newProduct);
  }

  @Mutation(() => Boolean, { description: 'Deletes a products given its ID' })
  @Authorized(Role.Admin, Role.SchoolAdmin)
  public async deleteProduct(@Arg('id', () => ID) id: number) {
    const product = await this.productRepository.findOneOrFail(id);
    await this.productRepository.remove(product);
    return true;
  }
}
