import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from '../addresses/addresses.service';
import { Address } from '../addresses/entities/address.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Address,
    ]),
  ],
  providers: [
    UsersResolver, //
    UsersService,
    AddressService,
  ],
})
export class UsersModule {}
