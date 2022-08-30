import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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
}
