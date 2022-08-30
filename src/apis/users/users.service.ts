import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne({ email }) {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  findWithDeleted() {
    return this.userRepository.find({
      withDeleted: true,
    });
  }

  async create({ hashedPassword: password, ...createUserInput }) {
    // 1. check if user email exist on User table
    const uniqueEmail = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });

    if (uniqueEmail) throw new ConflictException('이미 등록된 이메일 입니다.');

    // 2. save new user on User table
    return this.userRepository.save({ ...createUserInput, password });
  }

  async update({ userId, updateUserInput }) {
    // 1. fine user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. replace new user with old user
    const result = this.userRepository.save({
      ...myuser,
      id: userId,
      ...updateUserInput,
    });
    return result;
  }

  async updatePwd({ userId, password }) {
    // 1. fine user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. replace new password with old password
    const result = this.userRepository.save({
      ...myuser,
      id: userId,
      password,
    });
    return result;
  }

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({
      id: userId,
    });
    return result.affected ? true : false;
  }

  async undoDelete({ userId }) {
    const result = await this.userRepository.restore({
      id: userId,
    });
    return result.affected ? true : false;
  }
}
