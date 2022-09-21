import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportsService } from '../iamport/iamports.service';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      User,
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    IamportsService,
    UsersService,
  ],
})
export class PaymentsModule {}
