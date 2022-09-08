import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../quote/entities/quote.entity';
import { QuoteService } from '../quote/quotes.service';
import { BatchesController } from './batches.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), //
    TypeOrmModule.forFeature([
      Quote, //
    ]),
  ],
  controllers: [
    BatchesController, //
  ],
  providers: [
    TasksService, //
    QuoteService,
  ],
})
export class BatchesModule {}
