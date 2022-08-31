import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '../addresses/addresses.service';
import { CreateAddressInput } from '../addresses/dto/createAddress.input';
import { Address } from '../addresses/entities/address.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly addressesService: AddressService, //
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
    const { addresses, ...user } = createUserInput;

    // 1. check if user email exist on User table
    const uniqueEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (uniqueEmail) throw new ConflictException('이미 등록된 이메일 입니다.');

    // 2. save user
    const result = await this.userRepository.save({
      ...user,
      password,
    });

    // 3. save addresses
    await Promise.all(
      addresses.map((ele: CreateAddressInput) =>
        this.addressRepository.save({
          address: ele.address,
          addressDetail: ele.addressDetail,
          zipcode: ele.zipcode,
          user: result,
        }),
      ),
    );

    // 4. return user object
    return result;
  }

  async update({ userId, updateUserInput }) {
    const { addresses, ...user } = updateUserInput;

    // 1. fine user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. save new user
    const result = await this.userRepository.save({
      ...myuser,
      id: userId,
      ...user,
    });

    // 3. save addresses
    if (addresses) {
      // 3-1. user_id를 가진 address 전부 지우기
      const addressIdArray = myuser.addresses.map((ele) => ele.id);
      await Promise.all(
        addressIdArray.map((ele) => this.addressRepository.delete({ id: ele })),
      );

      // 3-2. 새로운 address 저장하기
      await Promise.all(
        addresses.map((ele: CreateAddressInput) =>
          this.addressRepository.save({
            address: ele.address,
            addressDetail: ele.addressDetail,
            zipcode: ele.zipcode,
            user: result,
          }),
        ),
      );
    }

    // 4. return user object
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
    // 1. fine user
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. softdelte user
    const result = await this.userRepository.softDelete({
      id: userId,
    });

    // 3. softdelete addresses
    const addressIdArray = myuser.addresses.map((ele) => ele.id);
    await Promise.all(
      addressIdArray.map((ele) =>
        this.addressesService.delete({ addressId: ele }),
      ),
    );

    return result.affected ? true : false;
  }

  async undoDelete({ userId }) {
    // 1. fine user
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
      withDeleted: true,
    });

    if (!myuser)
      throw new UnprocessableEntityException(
        '삭제 목록에 존재하지 않는 user_id 입니다',
      );

    // 2. restore user
    const result = await this.userRepository.restore({
      id: userId,
    });

    // 3. restore addresses
    const addressIdArray = myuser.addresses.map((ele) => ele.id);
    await Promise.all(
      addressIdArray.map((ele) =>
        this.addressesService.undoDelete({ addressId: ele }),
      ),
    );

    return result.affected ? true : false;
  }
}
