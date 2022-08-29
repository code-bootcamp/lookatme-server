import { Query, Resolver } from '@nestjs/graphql';
import { HelloWorldsService } from './helloWorld.service';

@Resolver()
export class helloWorldsResolver {
  constructor(
    private readonly helloWorldsService: HelloWorldsService, //
  ) {}

  @Query(() => String)
  sayHello() {
    return this.helloWorldsService.helloWorld();
  }
}
