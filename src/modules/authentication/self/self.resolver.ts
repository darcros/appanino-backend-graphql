import { Resolver, Query, Authorized, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../user/user.repository';
import { User, Role } from '../../../entity/user.entity';
import { LoggedInContext } from '../../../util/context.interface';

@Resolver()
export class SelfResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Authorized(Role.Admin, Role.SchoolAdmin, Role.User)
  @Query(() => User)
  public async self(@Ctx() ctx: LoggedInContext) {
    return this.userRepository.findOneOrFail(ctx.user.id);
  }
}
