import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { IamportsService } from '../iamport/iamports.service';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService, //
    private readonly importsService: IamportsService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment], { description: '결제 목록 조회' })
  fetchPayments(
    @Context() context: IContext, //
  ) {
    return this.paymentsService.findAll({ userId: context.req.user.id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: '결제 등록하기' })
  async createPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number, // only integer
    @Context() context: IContext,
  ) {
    // 1. 아임포트 서버에서 accessToken 요청
    const { access_token } = (await this.importsService.requestAccessToken())
      .data.response;

    // 2. 유효한 impUid인지 검증
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

    // 3. payment table에 데이터 저장
    const user = context.req.user;
    return this.paymentsService.create({ impUid, amount, user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: '결제 취소하기' })
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number, // 정수로만 받기
    @Args('reason') reason: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user;

    // 1. 아임포트 서버에서 accessToken 요청
    const { access_token } = (await this.importsService.requestAccessToken())
      .data.response;

    // 2. 중복 결제 취소인지 확인 및 결제했던 기록이 있는지 확인 및 결제 가능 금액인지 확인
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

    // 3. 아임포트에 환불 요청
    await this.importsService.cancelPay({
      impUid,
      amount,
      accessToken: access_token,
      reason,
    });

    // 4. payment table에 결제취소 내역 저장
    return this.paymentsService.cancel({ impUid, amount, user });
  }
}
