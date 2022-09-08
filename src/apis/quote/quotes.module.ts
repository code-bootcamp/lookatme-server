import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { QuoteResolver } from './quotes.resolver';
import { QuoteService } from './quotes.service';

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
