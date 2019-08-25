import { Authorized, Ctx, Mutation, Query, Resolver, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Role, User } from '../../../entity/user.entity';
import { LoggedInContext } from '../../../util/context.interface';
import { UserRepository } from '../../user/user.repository';
import { UserUpdateInput } from './userUpdate.input';

@Resolver()
export class SelfResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Query(() => User)
  public async self(@Ctx() ctx: LoggedInContext) {
    return this.userRepository.findOneOrFail(ctx.user.id);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Update data on the current user' })
  public async updateSelf(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: UserUpdateInput) {
    await this.userRepository.update(ctx.user.id, input);
    return this.userRepository.findOne(ctx.user.id);
  }
}
