import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  GqlAuthAccessGuard,
  GqlAuthSpecialistAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Resolver()
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Ticket], { description: '유저 자신이 구매한 티켓 조회' })
  async fetchOwnTickets(@Context() context: any) {
    const userId = context.req.user.id;
    return this.ticketsService.findOwnTickets({ userId });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Query(() => [Ticket], { description: '전문가 자신의 고객 조회' })
  async fetchSpecialistOwnCustomer(
    @Context() context: any, //
  ) {
    const specialistId = context.req.user.id;
    return this.ticketsService.findAllOwnCustomer({ specialistId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Ticket)
  async createTicket(
    @Context() context: any, //
    @Args('specialistId') specialistId: string,
  ) {
    const userId = context.req.user.id;
    return await this.ticketsService.create({ userId, specialistId });
  }
}
