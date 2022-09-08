import { Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { QuoteService } from '../quote/quotes.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry, //

    private readonly quotesService: QuoteService,
  ) {
    this.addCronJob(); // cron job 하나를 registry에 등록
  }

  addCronJob() {
    const name = 'cronQuote';

    const job = new CronJob(CronExpression.EVERY_10_SECONDS, async () => {
      await this.quotesService.selectRandomQuote();
    });

    this.schedulerRegistry.addCronJob(name, job);
  }
}
