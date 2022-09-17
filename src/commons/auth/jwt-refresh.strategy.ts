import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refreshToken = JSON.parse(JSON.stringify(req.headers)).cookie.replace(
      'refreshToken=',
      '',
    );
    const expired = await this.cacheManager.get(`refreshToken:${refreshToken}`);

    if (expired) throw new UnauthorizedException('이미 로그아웃 되었습니다.');

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
