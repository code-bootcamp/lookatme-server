import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductService } from '../products/product.service';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board, //
      Product,
    ]),
  ],
  providers: [
    BoardResolver, //
    BoardService,
    ProductService,
  ],
})
export class BoardModule {}
