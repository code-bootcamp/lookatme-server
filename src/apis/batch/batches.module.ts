import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../quote/entities/quote.entity';
import { QuoteService } from '../quote/quotes.service';
import { BatchesResolver } from './batches.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), //
    TypeOrmModule.forFeature([
      Quote, //
    ]),
  ],
  providers: [
    TasksService, //
    BatchesResolver,
    QuoteService,
  ],
})
export class BatchesModule {}
