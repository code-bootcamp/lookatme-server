import { UseGuards } from '@nestjs/common';
import { Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Resolver()
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService, //
  ) {}

  //   @UseGuards(GqlAuthAccessGuard)
  //   @Query(() => [Ticket])
  //   async fetchOwnTickets(@Context() context: any) {
  //     return this.ticketsService.findOwnTickets();
  //   }

  @Mutation(() => Ticket)
  async createTicket() {
    return await this.ticketsService.create();
  }
}
