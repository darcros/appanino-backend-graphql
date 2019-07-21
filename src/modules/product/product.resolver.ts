import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Authorized,
  InputType,
  Field,
  Mutation,
  Arg,
  Ctx,
  ID,
} from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Product } from '../../entity/product.entity';
import { ProductRepository } from './product.repository';
import { School } from '../../entity/school.entity';
import { Role } from '../../entity/user.entity';
import { LoggedInContext } from '../../util/context.interface';
import { SchoolRepository } from '../school/school.repository';

@InputType()
class NewProductDataInput {
  @Field(() => String)
  public name: string;

  @Field(() => Number)
  public price: number;

  @Field(() => [ID])
  public schoolIds: number[];
}

@Resolver(() => Product)
export class ProductResolver {
  @InjectRepository(ProductRepository)
  private readonly productRepository: ProductRepository;
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;

  @Query(() => [Product], { description: 'Returns a list of products' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async products(
    @Ctx() ctx: LoggedInContext,
    @Arg('getAll', {
      defaultValue: false,
      description: "If true returns all products, not just the products available in the user's school",
    })
    getAll: boolean,
  ) {
    // Return all products
    if (getAll) {
      return await this.productRepository.find();
    }

    // Return products of the school in which the user is in
    const schoolId = ctx.user.school.id;
    const school = await this.schoolRepository.findOne(schoolId, {
      relations: ['products'],
    });

    return school ? school.products : [];
  }

  @Query(() => Product, { nullable: true, description: 'Returns a product given its ID' })
  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  public async product(@Arg('id') id: number) {
    return await this.productRepository.findOne(id);
  }

  @Mutation(() => Product, { description: 'Creates a new product' })
  @Authorized(Role.Admin, Role.SchoolAdmin)
  public async addProduct(@Arg('newProductData') newProductData: NewProductDataInput) {
    const schools = await Promise.all(newProductData.schoolIds.map(id => this.schoolRepository.findOneOrFail(id)));

    const { name, price } = newProductData;
    return await this.productRepository.save({
      name,
      price,
      schools,
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
}
