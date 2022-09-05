import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { QuoteResolver } from './quote.resolver';
import { QuoteService } from './quote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quote, //
    ]),
  ],
  providers: [
    QuoteResolver, //
    QuoteService,
  ],
})
export class QuoteModule {}
