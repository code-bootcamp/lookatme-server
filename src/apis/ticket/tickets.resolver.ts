import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Resolver()
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Ticket])
  async fetchOwnTickets(@Context() context: any) {
    const userId = context.req.user.id;
    return this.ticketsService.findOwnTickets({ userId });
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
