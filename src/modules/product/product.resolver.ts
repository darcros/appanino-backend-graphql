import { Resolver, Query, FieldResolver, Root, Authorized, InputType, Field, Mutation, Arg, ID } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Product } from '../../entity/product.entity';
import { ProductRepository } from './product.repository';
import { School } from '../../entity/school.entity';
import { Role } from '../../entity/user.entity';
import { Category } from '../../entity/category.entity';
import { CategoryRepository } from '../category/category.repository';

@InputType()
class NewProductDataInput {
  @Field(() => String)
  public name: string;

  @Field(() => Number)
  public price: number;

  @Field(() => [ID])
  public schoolIds: number[];

  @Field(() => ID)
  public categoryId: number;
}

@Resolver(() => Product)
export class ProductResolver {
  @InjectRepository(ProductRepository)
  private readonly productRepository: ProductRepository;
  @InjectRepository(CategoryRepository)
  private readonly categoryRepository: CategoryRepository;

  @Query(() => [Product], { description: 'Returns all products' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async products() {
    return await this.productRepository.find();
  }

  @Query(() => Product, { nullable: true, description: 'Returns a product given its ID' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async product(@Arg('id') id: number) {
    return await this.productRepository.findOne(id);
  }

  @Mutation(() => Product, { description: 'Creates a new product' })
  @Authorized(Role.Admin, Role.SchoolAdmin)
  public async addProduct(@Arg('newProductData') newProductData: NewProductDataInput) {
    const { name, price, schoolIds, categoryId } = newProductData;

    return this.productRepository.save({
      name,
      price,
      schools: schoolIds.map(id => ({ id })),
      category: {
        id: categoryId,
      },
    });
  }

  @Mutation(() => Boolean, { description: 'Deletes a products given its ID' })
  @Authorized(Role.Admin, Role.SchoolAdmin)
  public async deleteProduct(@Arg('id') id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) return false;

    await this.productRepository.remove(product);
    return true;
  }

  @FieldResolver(() => [School])
  public async schools(@Root() product: Product) {
    const foundProduct = await this.productRepository.findOne(product.id, { relations: ['schools'] });

    return foundProduct ? foundProduct.schools : [];
  }

  @FieldResolver(() => Category)
  public async category(@Root() product: Product) {
    return this.categoryRepository.findOne({ where: { id: product.categoryId } });
  }
}
