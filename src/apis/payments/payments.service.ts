import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAYMENT_ENUM } from 'src/commons/type/enum';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // ================================ transaction 시작!!! ==================================
    await queryRunner.startTransaction('SERIALIZABLE');
    // ======================================================================================

    try {
      // 1. Payment 테이블에 거래기록 1줄 생성
      const payment = this.paymentsRepository.create({
        // 객체 생성
        impUid,
        amount,
        user: _user,
        status: PAYMENT_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(payment); // 객체 저장

      // 2. 유저의 돈 찾아오기
      const user = await queryRunner.manager.findOne(
        User, // user 테이블에서
        {
          where: { id: _user.id },
          lock: { mode: 'pessimistic_write' },
        },
      );

      // 3. 유저의 돈 업데이트
      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);

      // ================================ commit 성공 확정!!! ==================================
      await queryRunner.commitTransaction();
      // =====================================================================================

      // 4. 최종결과 프론트엔드에 돌려주기
      return payment;
    } catch {
      // ================================ rollback 되돌리기!!! ==================================
      await queryRunner.rollbackTransaction();
      // ======================================================================================
    } finally {
      // ==================================== 연결 해제!!! ======================================
      await queryRunner.release();
      // ======================================================================================
    }
  }

  async cancel({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // ================================ transaction 시작!!! ==================================
    await queryRunner.startTransaction('SERIALIZABLE');
    // ======================================================================================

    try {
      // 1. Payment 테이블에 취소기록 1줄 생성
      const cancel = this.paymentsRepository.create({
        // 객체 생성
        impUid,
        amount: -amount,
        user: _user,
        status: PAYMENT_ENUM.CANCEL,
      });
      await queryRunner.manager.save(cancel);

      // 2. 유저의 돈 찾아오기
      const user = await queryRunner.manager.findOne(
        User, // user 테이블에서
        {
          where: { id: _user.id },
          lock: { mode: 'pessimistic_write' },
        },
      );

      // 3. 유저의 돈 업데이트
      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point - amount,
      });
      await queryRunner.manager.save(updatedUser);

      // ================================ commit 성공 확정!!! ==================================
      await queryRunner.commitTransaction();
      // =====================================================================================

      // 4. 최종결과 프론트엔드에 돌려주기
      return cancel;
    } catch {
      // ================================ rollback 되돌리기!!! ==================================
      await queryRunner.rollbackTransaction();
      // ======================================================================================
    } finally {
      // ==================================== 연결 해제!!! ======================================
      await queryRunner.release();
      // ======================================================================================
    }
  }

  async hasPayment({ impUid }) {
    // 이미 payment table에 저장된 결제 정보 인지 검증
    const result = await this.paymentsRepository.findOne({
      where: { impUid: impUid, status: PAYMENT_ENUM.PAYMENT },
    });

    if (result) throw new ConflictException('이미 결제가 완료되었습니다.');
  }

  async hasCancel({ impUid }) {
    // 이미 payment table에 저장된 결제취소 정보 인지 검증
    const result = await this.paymentsRepository.findOne({
      where: { impUid: impUid, status: PAYMENT_ENUM.CANCEL },
    });

    if (result)
      throw new UnprocessableEntityException('이미 결제취소가 완료되었습니다.');
  }

  async cancelalbePoint({ user, amount }) {
    // 포인트가 취소하려는 금액보다 많은지 검증
    const result = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (result.point < amount)
      throw new ConflictException('취소 가능한 금액이 아닙니다.');
  }
}
