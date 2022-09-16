import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
  ) {}

  async findAll({ page }) {
    return await this.specialistRepository.find({
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findOneWithId({ id }) {
    const result = await this.specialistRepository.findOne({
      where: { id },
      relations: ['specialistReviews'],
    });

    if (!result)
      throw new UnprocessableEntityException(
        '존재하지 않는 specialist_id값 입니다.',
      );

    return result;
  }

  async findAllByPrice({ page }) {
    const result = await this.specialistRepository.find({
      order: { price: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async findAllByRate({ page }) {
    const result = await this.specialistRepository.find({
      order: { averageRate: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });

    return result;
  }

  async isSpecialsit({ specialist }) {
    const result = await this.specialistRepository.findOne({
      where: { id: specialist.id, account: specialist.email },
    });

    return result ? true : false;
  }

  async create({ hashedPassword, ...createSpecialistInput }) {
    const existAccount = await this.specialistRepository.findOne({
      where: { account: createSpecialistInput.account },
    });

    if (existAccount) throw new ConflictException('이미 등록된 아이디입니다.');

    const result = await this.specialistRepository.save({
      ...createSpecialistInput,
      password: hashedPassword,
    });

    return result;
  }

  async update({ specialistId, updateSpecialistInput }) {
    const specialistToUpdate = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    if (!specialistToUpdate)
      throw new UnprocessableEntityException('존재하지 않는 id값입니다.');

    const result = await this.specialistRepository.save({
      ...specialistToUpdate,
      id: specialistId,
      ...updateSpecialistInput,
    });

    return result;
  }

  async delete({ id }) {
    const specialistToDelete = await this.specialistRepository.findOne({
      where: { id },
    });

    if (!specialistToDelete)
      throw new UnprocessableEntityException(
        '존재하지 않는 id값이거나 이미 삭제된 대상입니다.',
      );

    const result = await this.specialistRepository.softDelete({ id });

    return result.affected ? true : false;
  }

  async restore({ id }) {
    const deletedSpecialist = await this.specialistRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!deletedSpecialist)
      throw new UnprocessableEntityException(
        '삭제 목록에 존재하지 않는 id 입니다',
      );

    const result = await this.specialistRepository.restore({ id });

    return result.affected ? true : false;
  }
}
