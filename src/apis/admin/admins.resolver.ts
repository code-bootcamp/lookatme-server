import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { CreateAdminInput } from './dto/createAdmin.input';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Resolver()
export class AdminsResolver {
  constructor(
    private readonly adminsService: AdminsService, //
  ) {}

  ///////////////////////// Mutation ///////////////////////
  @Mutation(() => Admin)
  async createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createAdminInput.password, 10.2);
    return this.adminsService.create({ hashedPassword, ...createAdminInput });
  }
}
