import * as bcrypt from 'bcrypt';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../../entity/user.entity';
import { Context, LoggedInContext } from '../../../util/context.interface';
import { UserRepository } from '../../user/user.repository';
import { PasswordUpdateInput } from './passwordUpdate.input';
import { UserUpdateInput } from './userUpdate.input';
import { WRONG_PASSWORD } from './wrongPassword.error';
import { SAME_PASSWORD } from './samePassword.error';
import { EmailUpdateInput } from './emailUpdate.input';
import { NONEXISTENT_EMAIL } from './nonexistentEmail.error';

@Resolver()
export class SelfResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Query(() => User, { nullable: true })
  public async self(@Ctx() ctx: Context) {
    if (!ctx.user) return null;
    return this.userRepository.findOneOrFail(ctx.user.id);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Update data on the current user' })
  public async updateSelf(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: UserUpdateInput) {
    await this.userRepository.update(ctx.user.id, input);
    return this.userRepository.findOneOrFail(ctx.user.id);
  }

  @Authorized()
  @Mutation(() => User, { description: 'Update the email of the current user' })
  public async updateEmail(@Ctx() ctx: LoggedInContext, @Arg('updateData') input: EmailUpdateInput) {
    // FIXME: this is only temporary
    // TODO: actually send email to the address to verify it's existence
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const { newEmail } = input;
    if (!emailRegex.test(newEmail)) {
      throw NONEXISTENT_EMAIL;
    }

    const user = await this.userRepository.findOneOrFail(ctx.user.id);
    user.email = newEmail;
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
