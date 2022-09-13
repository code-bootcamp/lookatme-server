import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { User } from '../user/entities/user.entity';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
  ) {}

  async create({ userId, specialistId }) {
    const date = new Date();
    const expired = new Date(date);
    expired.setDate(date.getDate() + 14);

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    const result = await this.ticketsRepository.save({
      expired,
      user,
      specialist,
    });
    return result;
  }
}
