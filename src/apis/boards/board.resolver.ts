import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board, { description: '피드 등록 API' })
  async createBoard(
    @Context() context: any, //
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ) {
    const userId = context.req.user.id;
    return await this.boardService.create({ createBoardInput, userId });
  }
}
