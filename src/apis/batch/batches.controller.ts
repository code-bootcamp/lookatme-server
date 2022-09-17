import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batches')
export class BatchesController {
  constructor(private scheduler: SchedulerRegistry) {}

  @UseGuards(AuthGuard('admin_access'))
  @Post('/start/quote')
  start() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.start();
  }

  @UseGuards(AuthGuard('admin_access'))
  @Post('/stop/quote')
  stop() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.stop();
  }
}
