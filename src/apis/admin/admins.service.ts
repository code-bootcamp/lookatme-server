import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  findOne({ email }) {
    return this.adminRepository.findOne({
      where: { email: email },
    });
  }

  async create({ hashedPassword: password, ...createAdminInput }) {
    // 1. check if user email exist on User table
    const uniqueEmail = await this.adminRepository.findOne({
      where: { email: createAdminInput.email },
    });

    if (uniqueEmail) throw new ConflictException('이미 등록된 이메일 입니다.');

    // 2. save user
    return await this.adminRepository.save({
      ...createAdminInput,
      password,
    });
  }
}
