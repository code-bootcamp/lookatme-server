import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldsService {
  helloWorld() {
    return 'Hello World!';
  }
}
