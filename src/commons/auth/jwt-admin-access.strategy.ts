import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { Repository } from 'typeorm';

export class JwtAdminAccessStrategy extends PassportStrategy(
  Strategy,
  'admin_access',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const result = await this.adminRepository.findOne({
      where: { id: payload.sub, email: payload.email },
    });

    if (!result) throw new UnauthorizedException('관리자 권한이 필요합니다.');

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
