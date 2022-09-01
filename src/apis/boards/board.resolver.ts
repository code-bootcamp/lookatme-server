import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}
  @Mutation(() => Board, { description: '피드 등록 API' })
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ) {
    return await this.boardService.create({ createBoardInput });
  }
}
