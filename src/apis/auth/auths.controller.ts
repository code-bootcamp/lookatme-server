import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthsService } from './auths.service';
import { Request, Response } from 'express';

interface IOAuthUser {
  user: {
    email: string;
    hashedPassword: string;
    name: string;
    id: string;
    phone_number: string;
    nickname: string;
  };
}

/**
 *  Description : API docs for social login
 *  Constructor : AuthsService
 *  Content :
 *    [ Get ]
 *      /login/google       [ req: Request & IOAuthUsr, res: Response ]
 *                            : 구글 소셜 로그인 API
 *      /login/naver        [ req: Request & IOAuthUsr, res: Response ]
 *                            : 네이버 소셜 로그인 API
 *      /login/kakao        [ req: Request & IOAuthUsr, res: Response ]
 *                            : 카카오 소셜 로그인 API
 */

@Controller()
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService, //
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLogin({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLogin({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authsService.socialLogin({ req, res });
  }
}
