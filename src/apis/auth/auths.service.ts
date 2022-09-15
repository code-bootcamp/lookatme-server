import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
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

  setRefreshToken({ user, res, req }) {
    try {
      const refreshToken = this.jwtServices.sign(
        {
          email: user.email, //
          sub: user.id,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET, // secret code
          expiresIn: '24h', // expiration period
        },
      );

      // 개발 graphql 환경
      // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

      const allowedOrigins = [
        process.env.CLIENT_DOMAIN,
        process.env.LOCALHOST_DOMAIN,
        `https://${process.env.SERVER_DOMAIN}`,
      ];
      const origin = req.headers.origin;

      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }

      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,OPTIONS,POST,PUT',
      );
      res.setHeader(
        'Access-Control-Allow-Header',
        'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      );

      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.${String(
          process.env.SERVER_DOMAIN,
        )}; SameSite=None; Secure; httpOnly;`,
      );

      return true;
    } catch {
      return false;
    }
  }

  getAccessToken({ user }) {
    return this.jwtServices.sign(
      {
        email: user.email, //
        sub: user.id,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET, // secret code
        expiresIn: '1h', // expiration period
      },
    );
  }

  getSpecialistAccessToken({ specialist }) {
    return this.jwtServices.sign(
      {
        email: specialist.account, //
        sub: specialist.id,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET, // secret code
        expiresIn: '1h', // expiration period
      },
    );
  }

  async socialLogin({ req, res }) {
    // 1. verify if valid user
    let user = await this.usersService.findOneWithEmail({
      email: req.user.email,
    });

    if (!user)
      // 2. register new user
      user = await this.usersService.create({
        ...req.user,
      });
    else throw new ConflictException('이미 등록된 이메일 입니다.');

    // 3. 로그인 (accessToken 만들어서 프론트엔드에 추가)
    this.setRefreshToken({ user, res, req });
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
