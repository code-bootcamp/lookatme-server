import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { User } from '../user/entities/user.entity';
import { Ticket } from './entities/ticket.entity';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket, //
      User,
      Specialist,
    ]),
  ],
  providers: [
    TicketsResolver, //
    TicketsService,
  ],
})
export class TicketsModule {}
