import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async delete({ addressId }) {
    const result = await this.addressRepository.softDelete({
      id: addressId,
    });
    return result.affected ? true : false;
  }

  async undoDelete({ addressId }) {
    const result = await this.addressRepository.restore({
      id: addressId,
    });
    return result.affected ? true : false;
  }
}
