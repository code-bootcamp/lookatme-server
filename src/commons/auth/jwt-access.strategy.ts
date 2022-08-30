import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accessToken = JSON.parse(
      JSON.stringify(req.headers),
    ).authorization.replace('Bearer ', '');
    const expired = await this.cacheManager.get(`accessToken:${accessToken}`);

    if (expired) throw new UnauthorizedException('이미 로그아웃 되었습니다.');

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
