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
  async create({ createProductInput }) {
    const { name, price, description, img_url } = createProductInput;

    const result = await this.productRepository.save({
      name,
      price,
      description,
      img_url,
    });

    return result;
  }
}
