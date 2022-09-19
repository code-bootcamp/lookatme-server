import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { IamportsService } from '../iamport/iamports.service';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

/**
 *  Description : API docs for payment process
 *  Constructor : PaymentsService, IamportsService
 *  Content :
 *    [ Query ]
 *      fetchPayments       [ context: IContext, page: Int => [Payment] ]
 *                            : 결제 기록 조회 API
 *    [ Mutation ]
 *      createPayment       [ impUid: String, amount: Int, context: IContext => Payment ]
 *                            : 결제 등록하기 API
 *      cancelPayment       [ impUid: String, amount: Int, reason: String, context: IContext => Payment ]
 *                            : 결제 취소하기 API
 */

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService, //
    private readonly importsService: IamportsService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment], { description: '결제 기록 조회' })
  fetchPayments(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.paymentsService.findAll({ userId: context.req.user.id, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: '결제 등록하기' })
  async createPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ) {
    const { access_token } = (await this.importsService.requestAccessToken())
      .data.response;

    try {
      await this.importsService.verifyImpUid({
        impUid,
        amount,
        accessToken: access_token,
      });
      await this.paymentsService.hasPayment({ impUid });
    } catch (error) {
      throw new HttpException(
        error.response.message, //
        error.status,
      );
    }

    const user = context.req.user;
    return this.paymentsService.create({ impUid, amount, user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: '결제 취소하기' })
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Args('reason') reason: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user;

    const { access_token } = (await this.importsService.requestAccessToken())
      .data.response;

    try {
      await this.importsService.verifyImpUid({
        impUid,
        amount,
        accessToken: access_token,
      });
      await this.paymentsService.hasCancel({ impUid });
      await this.paymentsService.cancelalbePoint({ user, amount });
    } catch (error) {
      throw new HttpException(
        error.response.message, //
        error.status,
      );
    }

    await this.importsService.cancelPay({
      impUid,
      amount,
      accessToken: access_token,
      reason,
    });

    return this.paymentsService.cancel({ impUid, amount, user });
  }
}
