import { ConflictException, Injectable } from '@nestjs/common';
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

  async findOwnTickets({ userId, page }) {
    const result = await this.ticketsRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['specialist', 'chatMessages', 'specialistChatMessages'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async findAllOwnCustomer({ specialistId, page }) {
    const result = await this.ticketsRepository.find({
      where: { specialist: { id: specialistId } },
      relations: ['user'],
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async create({ userId, specialistId }) {
    const date = new Date();
    const expired = new Date();
    expired.setDate(date.getDate() + 14);

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    const userPoint = user.point;
    const specialistPrice = specialist.price;

    if (userPoint < specialistPrice)
      throw new ConflictException('포인트가 부족합니다.');

    const restPoint = userPoint - specialistPrice;

    await this.usersRepository.save({
      ...user,
      id: userId,
      point: restPoint,
    });

    const result = await this.ticketsRepository.save({
      expired,
      user,
      specialist,
    });

    return result;
  }

  async useTicket({ userId, ticketId }) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['tickets'],
    });

    const userTicket = user.tickets;

    if (userTicket.every((ele) => ele.id !== ticketId))
      throw new ConflictException('해당 유저의 ticket이 아닙니다.');

    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
    });

    if (ticket.used)
      throw new ConflictException('이미 사용 완료된 티켓입니다.');

    return this.ticketsRepository.save({
      ...ticket,
      id: ticketId,
      used: true,
    });
  }
}
