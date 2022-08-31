import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtAdminAccessStrategy } from 'src/commons/auth/jwt-admin-access.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { AddressService } from '../addresses/addresses.service';
import { Address } from '../addresses/entities/address.entity';
import { AdminsService } from '../admin/admins.service';
import { Admin } from '../admin/entities/admin.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthsController } from './auths.controller';
import { AuthsResolver } from './auths.resolver';
import { AuthsService } from './auths.service';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, // usersSevice uses Product, User Repository
      Address,
      Admin,
    ]),
  ],
  providers: [
    JwtAdminAccessStrategy, // declare location of provider doesn't matter
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
    JwtGoogleStrategy,
    AuthsResolver,
    AuthsService,
    UsersService,
    AdminsService,
    AddressService,
  ],
  controllers: [
    AuthsController, //
  ],
})
export class AuthsModule {}
