import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Product,
    ]),
  ],
  // controllers: [],
  providers: [
    UsersResolver, //
    UsersService,
  ],
})
export class UsersModule {}
