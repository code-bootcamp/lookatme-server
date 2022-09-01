import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductInput } from '../products/dto/createProduct.input';
import { Product } from '../products/entities/product.entity';
import { ProductService } from '../products/product.service';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productService: ProductService,
  ) {}

  async create({ createBoardInput }) {
    const { products, ...board } = createBoardInput;

    const result = await this.boardRepository.save({
      ...board,
    });

    console.log(result);

    await Promise.all(
      products.map((el: CreateProductInput) =>
        this.productRepository.save({
          name: el.name,
          price: el.price,
          description: el.description,
          img_url: el.img_url,
          board: result.id,
        }),
      ),
    );
    return result;
  }
}
