import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUserInput';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  ////////////////////Query/////////////////////////

  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOne({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.usersService.findOne({ email });
  }

  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.usersService.findWithDeleted();
  }

  ////////////////////Mutation/////////////////////////

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10.2);
    return this.usersService.create({ hashedPassword, ...createUserInput });
  }

  @Mutation(() => User)
  updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({ userId, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: any, //
    @Args('newPassword') newPassword: string,
  ) {
    const userId = context.req.user.id;
    const password = await bcrypt.hash(newPassword, 10.2);

    return this.usersService.updatePwd({ userId, password });
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.delete({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Context() context: any, //
  ) {
    const userId = context.req.user.id;
    return this.usersService.delete({ userId });
  }

  @Mutation(() => Boolean)
  restoreUser(@Args('userId') userId: string) {
    return this.usersService.undoDelete({ userId });
  }
}
