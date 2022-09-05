import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialist } from './entities/specialist.entity';
import { SpecialistResolver } from './specialist.resolver';
import { SpecialistService } from './specialist.service';

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
