import * as bcrypt from 'bcrypt';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Role, User } from '../../../entity/user.entity';
import { LoggedInContext } from '../../../util/context.interface';
import { UserRepository } from '../../user/user.repository';
import { PasswordUpdateInput } from './passwordUpdate.input';
import { UserUpdateInput } from './userUpdate.input';
import { WRONG_PASSWORD } from './wrongPassword.error';
import { SAME_PASSWORD } from './samePassword.error';
import { EmailUpdateInput } from './emailUpdate.input';

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

  @Authorized()
  @Mutation(() => User, { description: 'Update the email of the current user' })
  public async updateEmail(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: EmailUpdateInput) {
    const user = await this.userRepository.findOneOrFail(ctx.user.id);
    user.email = input.newEmail;
    return this.userRepository.save(user);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Update the password of the current user' })
  public async updatePassword(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: PasswordUpdateInput) {
    const user = await this.userRepository.findOneOrFail(ctx.user.id);
    const { oldPassword, newPassword } = input;

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw WRONG_PASSWORD;
    }

    if (oldPassword === newPassword) {
      throw SAME_PASSWORD;
    }

    user.password = newPassword;
    return this.userRepository.save(user);
  }
}
