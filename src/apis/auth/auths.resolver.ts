import {
  ConflictException,
  HttpException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../user/users.service';
import { AuthsService } from './auths.service';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/commons/type/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
import { AdminsService } from '../admin/admins.service';
import { Repository } from 'typeorm';
import { Specialist } from '../specialist/entities/specialist.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver()
export class AuthsResolver {
  constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,

    private readonly authsService: AuthsService, //

    private readonly usersService: UsersService,

    private readonly adminsService: AdminsService,
  ) {}

  /////////////////////////////// Mutation //////////////////////////////////////
  @Mutation(() => String, { description: '로그인' })
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 로그인 (이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOneWithEmail({ email });

    // 2. 일치하는 유저가 없으면 에러 던지기
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 이메일 입니다.');

    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸을 경우
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT) 생성 및 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    if (
      !this.authsService.setRefreshToken({
        user,
        res: context.res,
        req: context.req,
      })
    )
      throw new ConflictException('쿠키에 refreshToken 세팅을 실패하였습니다.');

    // 5. 일치하는 유저, 비밀번호도 맞은 경우
    //  ==> accessToken(=JWT) 만들어서 브라우저에 전달하기
    return this.authsService.getAccessToken({ user });
  }

  @Mutation(() => String, { description: '관리자 로그인' })
  async adminLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 로그인 (이메일이 일치하는 관리자를 DB에서 찾기)
    const admin = await this.adminsService.findOne({ email });

    // 2. 일치하는 관리자가 없으면 에러 던지기
    if (!admin)
      throw new UnprocessableEntityException(
        '존재하지 않는 관리자 이메일 입니다.',
      );

    // 3. 일치하는 관리자가 있지만 비밀번호가 틀렸을 경우
    const isAuth = await bcrypt.compare(password, admin.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT) 생성 및 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    if (
      !this.authsService.setRefreshToken({
        user: admin,
        res: context.res,
        req: context.req,
      })
    )
      throw new ConflictException('쿠키에 refreshToken 세팅을 실패하였습니다.');

    // 5. 일치하는 관리자, 비밀번호도 맞은 경우
    //  ==> accessToken(=JWT) 만들어서 브라우저에 전달하기
    return this.authsService.getAccessToken({ user: admin });
  }

  @Mutation(() => String, { description: '전문가 로그인' })
  async specialistLogin(
    @Args('account') account: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const specialist = await this.specialistRepository.findOne({
      where: { account },
    });

    if (!specialist)
      throw new UnprocessableEntityException(
        '존재하지 않는 전문가 이메일 입니다.',
      );

    const isAuth = await bcrypt.compare(password, specialist.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    if (
      !this.authsService.setRefreshToken({
        user: specialist,
        res: context.res,
        req: context.req,
      })
    )
      throw new ConflictException('쿠키에 refreshToken 세팅을 실패하였습니다.');

    return this.authsService.getAccessToken({ user: specialist });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String, { description: '로그아웃' })
  async logout(
    @Context() context: IContext, //
  ) {
    const header = JSON.parse(JSON.stringify(context.req.headers));
    const accessToken = header.authorization.replace('Bearer ', '');
    const refreshToken = header.cookie.replace('refreshToken=', '');

    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
  @Mutation(() => String, { description: '악세스 토큰 재발급' })
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
