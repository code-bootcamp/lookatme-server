import { Module } from '@nestjs/common';
import { IamportsService } from './iamports.service';

@Module({
  providers: [
    IamportsService, //
  ],
})
export class IamportsModule {}
