import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsResolver } from './admins.resolver';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin, //
    ]),
  ],
  providers: [
    AdminsResolver, //
    AdminsService,
  ],
})
export class AdminsModule {}
