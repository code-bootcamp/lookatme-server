import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

export class JwtSpecialistAccessStrategy extends PassportStrategy(
  Strategy,
  'specialist_access',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, //
    private readonly specialistRepository: Repository<Specialist>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const result = await this.specialistRepository.findOne({
      where: { id: payload.sub },
    });

    if (!result)
      throw new UnauthorizedException('전문 상담사 계정이 아닙니다.');

    const accessToken = JSON.parse(
      JSON.stringify(req.headers),
    ).authorization.replace('Bearer ', '');

    const expired = await this.cacheManager.get(`accessToken:${accessToken}`);

    if (expired) throw new UnauthorizedException('이미 로그아웃 되었습니다.');

    return {
      id: payload.sub,
    };
  }
}
