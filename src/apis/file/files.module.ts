import { Module } from '@nestjs/common';
import { FileResolver } from './files.resolver';
import { FileService } from './files.service';

@Module({
  providers: [
    FileResolver, //
    FileService,
  ],
})
export class FileModule {}
