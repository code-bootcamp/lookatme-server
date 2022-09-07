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

  async findAll() {
    return await this.specialistRepository.find();
  }

  async findOneWithId({ id }) {
    const result = await this.specialistRepository.findOne({ where: { id } });

    if (!result)
      throw new UnprocessableEntityException(
        '존재하지 않는 specialist_id값 입니다.',
      );

    return result;
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

  async update({ id, updateSpecialistInput }) {
    const specialistForUpdate = await this.specialistRepository.findOne({
      where: { id },
    });

    if (!specialistForUpdate)
      throw new UnprocessableEntityException('존재하지 않는 id값입니다.');

    const result = await this.specialistRepository.save({
      ...specialistForUpdate,
      id,
      ...updateSpecialistInput,
    });

    return result;
  }

  async delete({ id }) {
    const specialistForDelete = await this.specialistRepository.findOne({
      where: { id },
    });

    if (!specialistForDelete)
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
