import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService, //
  ) {}

  @Query(() => [Board])
  async fetchBoards() {
    return this.boardService.findAll();
  }

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
