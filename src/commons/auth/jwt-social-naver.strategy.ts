import { Strategy } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken, refreshToken, profile);
    return {
      email: profile.email,
      hashedPassword: '1234',
      name: profile.name,
      id: profile.id,
      phone_number: profile.mobile.replace(/-/gi, ''),
      nickname: profile.nickname,
    };
  }
}
