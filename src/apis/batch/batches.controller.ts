import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchesController {
  constructor(private scheduler: SchedulerRegistry) {}

  @Post('/start/quote')
  start() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.start();
    console.log('start!! ', job.lastDate());
  }

  @Post('/stop/quote')
  stop() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.stop();
    console.log('stopped!! ', job.lastDate());
  }
}
