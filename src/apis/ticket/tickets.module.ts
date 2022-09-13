import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket, //
    ]),
  ],
  providers: [
    TicketsResolver, //
    TicketsService,
  ],
})
export class TicketsModule {}
