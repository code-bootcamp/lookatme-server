import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../quotes/entities/quote.entity';
import { QuoteService } from '../quotes/quote.service';
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
