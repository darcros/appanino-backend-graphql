import * as bcrypt from 'bcrypt';
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Order } from '../../entity/order.entity';
import { School } from '../../entity/school.entity';
import { Role, User } from '../../entity/user.entity';
import { LoggedInContext } from '../../util/context.interface';
import { OrderRepository } from '../order/order.repository';
import { SchoolRepository } from '../school/school.repository';
import { PasswordUpdateInput } from './passwordUpdate.input';
import { UserRepository } from './user.repository';
import { WRONG_PASSWORD } from './wrongPassword.error';

@Resolver(() => User)
export class UserResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;
  @InjectRepository(SchoolRepository)
  private readonly schoolRepository: SchoolRepository;
  @InjectRepository(OrderRepository)
  private readonly orderRepository: OrderRepository;

  @Authorized(Role.Admin)
  @Query(() => [User])
  public async users() {
    return await this.userRepository.find();
  }

  @Authorized()
  @Mutation(() => User, { description: 'Update the password of the current user' })
  public async updatePassword(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: PasswordUpdateInput) {
    const { oldPassword, newPassword } = input;
    const user = await this.userRepository.findOneOrFail(ctx.user.id);

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw WRONG_PASSWORD;
    }

    user.password = newPassword;
    return this.userRepository.save(user);
  }

  @FieldResolver(() => School)
  public async school(@Root() user: User) {
    return await this.schoolRepository.findOne({ where: { id: user.schoolId } });
  }

  @FieldResolver(() => [Order])
  public async orders(@Root() user: User) {
    return await this.orderRepository.find({ where: { userId: user.id } });
  }
}
