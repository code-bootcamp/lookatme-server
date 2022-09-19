import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchedulerRegistry } from '@nestjs/schedule';

/**
 *  Description : API docs for quote scheduler
 *  Constructor : SchedulerRegistry
 *  Content :
 *    [ Get ]
 *      /batches/start/quote        [ None ]
 *                                    : 명언 자동 새로고침 시작 API
 *      /batches/stop/quote         [ None ]
 *                                    : 명언 자동 새로고침 종료 API
 */

@Controller('batches')
export class BatchesController {
  constructor(
    private scheduler: SchedulerRegistry, //
  ) {}

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
