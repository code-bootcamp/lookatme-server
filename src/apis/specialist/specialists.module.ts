import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from './entities/specialist.entity';
import { SpecialistResolver } from './specialists.resolver';
import { SpecialistService } from './specialists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Specialist, //
    ]),
  ],
  providers: [
    SpecialistResolver, //
    SpecialistService,
  ],
})
export class SpecialistModule {}
