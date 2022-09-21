import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { SchedulerRegistry } from '@nestjs/schedule';
import { GqlAuthAdminAccessGuard } from 'src/commons/auth/gql-auth.guard';

/**
 *  Description : API docs for quote scheduler
 *  Constructor : SchedulerRegistry
 *  Content :
 *    [ Get ]
 *      startQuote        [ None ]
 *                          : 명언 자동 새로고침 시작 API
 *      stopQuote         [ None ]
 *                          : 명언 자동 새로고침 종료 API
 */

@Resolver()
export class BatchesResolver {
  constructor(
    private scheduler: SchedulerRegistry, //
  ) {}

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => String)
  startQuote() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.start();

    return '명언 자동 새로고침이 실행되었습니다.';
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => String)
  stopQuote() {
    const job = this.scheduler.getCronJob('cronQuote');

    job.stop();

    return '명언 자동 새로고침이 중지되었습니다.';
  }
}
