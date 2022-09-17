import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAYMENT_ENUM } from 'src/commons/type/enum';
import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly usersService: UsersService,
  ) {}

  async findAll({ userId, page }) {
    const user = await this.usersService.findOneWithId({ userId });

    return this.paymentsRepository.find({
      where: { user: user },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const payment = this.paymentsRepository.create({
        impUid,
        amount,
        user: _user,
        status: PAYMENT_ENUM.PAYMENT,
      });
      await queryRunner.manager.save(payment);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return payment;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const cancel = this.paymentsRepository.create({
        impUid,
        amount: -amount,
        user: _user,
        status: PAYMENT_ENUM.CANCEL,
      });
      await queryRunner.manager.save(cancel);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point - amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      return cancel;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async hasPayment({ impUid }) {
    const result = await this.paymentsRepository.findOne({
      where: { impUid: impUid, status: PAYMENT_ENUM.PAYMENT },
    });

    if (result) throw new ConflictException('이미 결제가 완료되었습니다.');
  }

  async hasCancel({ impUid }) {
    const result = await this.paymentsRepository.findOne({
      where: { impUid: impUid, status: PAYMENT_ENUM.CANCEL },
    });

    if (result)
      throw new UnprocessableEntityException('이미 결제취소가 완료되었습니다.');
  }

  async cancelalbePoint({ user, amount }) {
    const result = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (result.point < amount)
      throw new ConflictException('취소 가능한 금액이 아닙니다.');
  }
}
