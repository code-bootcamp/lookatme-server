import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { CreateAdminInput } from './dto/createAdmin.input';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class AdminsResolver {
  constructor(
    private readonly adminsService: AdminsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean, { description: '관리자 로그인 확인' })
  isAdmin(
    @Context() context: IContext, //
  ) {
    return this.adminsService.isAdmin({ admin: context.req.user });
  }

  @Mutation(() => Admin, { description: '관리자 회원가입' })
  async createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput, //
  ) {
    const hashedPassword = await bcrypt.hash(
      createAdminInput.password,
      Number(process.env.HASH_SALT),
    );
    return this.adminsService.create({ hashedPassword, ...createAdminInput });
  }
}
