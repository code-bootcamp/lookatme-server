import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create() {
    const date = new Date();
    const expired = new Date(date);
    expired.setDate(date.getDate() + 14);

    const result = await this.ticketRepository.save({
      expired,
    });
    return result;
  }
}
