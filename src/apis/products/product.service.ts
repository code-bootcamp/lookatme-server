import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, //
  ) {}
  async findAll() {
    return await this.productRepository.find();
  }

  async create({ createProductInput, userId }) {
    const { name, price, description, img_url } = createProductInput;

    const result = await this.productRepository.save({
      name,
      price,
      description,
      img_url,
      user: userId,
    });
    return result;
  }

  // async update({ id, updateProductInput }) {
  //   const { name, price, description, img_url } = updateProductInput;

  //   const productForUpdate = await this.productRepository.findOne({
  //     where: { id },
  //   });

  // }
}
