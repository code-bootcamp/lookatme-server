import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtServices: JwtService, //
    private readonly usersService: UsersService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtServices.sign(
      {
        email: user.email, //
        sub: user.id,
      },
      {
        secret: 'myRefreshKey', // secret code
        expiresIn: '2w', // expiration period
      },
    );

    // 개발환경 할때 실제 배포에서는 안됨
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`); // 프론트 브라우저 쿠키에 저장하기

    // 배포환경
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.mybackendsite.com; SameSite=None; Secure; httpOnly;`,
    // );
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  getAccessToken({ user }) {
    return this.jwtServices.sign(
      {
        email: user.email, //
        sub: user.id,
      },
      {
        secret: 'myAccessKey', // secret code
        expiresIn: '1h', // expiration period
      },
    );
  }

  async socialLogin({ req, res }) {
    // 1. verify if valid user
    let user = await this.usersService.findOne({ email: req.user.email });

    if (!user)
      // 2. register new user
      user = await this.usersService.create({
        ...req.user,
      });
    else throw new ConflictException('이미 등록된 이메일 입니다.');

    // 3. 로그인 (accessToken 만들어서 프론트엔드에 추가)
    this.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/frontend/login/index.html', // 원래 페이지로 돌아기기
    );
  }

  async saveTokenToRedis({ accessToken, refreshToken }) {
    const time = Math.ceil(new Date().getTime() * 0.001);
    const accessTokenExp = JSON.parse(
      JSON.stringify(jwt.decode(accessToken)),
    ).exp;
    const refreshTokenExp = JSON.parse(
      JSON.stringify(jwt.decode(refreshToken)),
    ).exp;

    await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
      ttl: accessTokenExp - time, // exp - now_time
    });

    await this.cacheManager.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: refreshTokenExp - time, // exp - now_time
    });
  }
}
