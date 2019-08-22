import { Resolver, Mutation, InputType, Field, ID, Arg } from 'type-graphql';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../user/user.repository';
import { User } from '../../../entity/user.entity';

@InputType()
class UserRegistrationDataInput {
  @Field(() => String)
  public firstname: string;

  @Field(() => String)
  public lastname: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => ID)
  public schoolId: number;
}

@Resolver()
export class RegistrationResolver {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @Mutation(() => User, { description: 'creates a new user' })
  public async register(@Arg('userRegistrationData') userRegistrationData: UserRegistrationDataInput) {
    console.log(userRegistrationData);

    const hashedPassword = await bcrypt.hash(userRegistrationData.password, 10);
    const newUser = await this.userRepository.save({
      ...userRegistrationData,
      password: hashedPassword,
    });

    return newUser;
  }
}
