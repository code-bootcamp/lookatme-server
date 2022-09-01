import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImage } from '../boardImages/entities/boardImage.entity';
import { Mood } from '../moods/entities/mood.entity';
import { Product } from '../products/entities/product.entity';
import { ProductService } from '../products/product.service';
import { Tag } from '../tags/entities/tag.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board, //
      Product,
      BoardImage,
      Mood,
      Tag,
    ]),
  ],
  providers: [
    BoardResolver, //
    BoardService,
    ProductService,
  ],
})
export class BoardModule {}
