import {
  HttpException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { AuthsService } from './auths.service';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/commons/type/context';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthsResolver {
  constructor(
    private readonly authsService: AuthsService, //

    private readonly usersService: UsersService,
  ) {}

  /////////////////////////////// Mutation //////////////////////////////////////
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOne({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 이메일 입니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸을 경우
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT) 생성 및 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authsService.setRefreshToken({ user, res: context.res });

    // 5. 일치하는 유저, 비밀번호도 맞은 경우
    //  ==> accessToken(=JWT) 만들어서 브라우저에 전달하기
    return this.authsService.getAccessToken({ user });
  }

  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //
  ) {
    const header = JSON.parse(JSON.stringify(context.req.headers));
    const accessToken = header.authorization.replace('Bearer ', '');
    const refreshToken = header.cookie.replace('refreshToken=', '');

    try {
      jwt.verify(accessToken, 'myAccessKey');
      jwt.verify(refreshToken, 'myRefreshKey');
    } catch (error) {
      throw new HttpException(
        error.response.message, //
        error.status,
      );
    }

    this.authsService.saveTokenToRedis({ accessToken, refreshToken });

    return '로그아웃에 성공했습니다.';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
