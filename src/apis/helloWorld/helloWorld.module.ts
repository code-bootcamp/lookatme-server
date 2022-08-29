import { Module } from '@nestjs/common';
import { helloWorldsResolver } from './helloWorld.resolver';
import { HelloWorldsService } from './helloWorld.service';

@Module({
  providers: [
    helloWorldsResolver, //
    HelloWorldsService,
  ],
})
export class helloWorldsModule {}
