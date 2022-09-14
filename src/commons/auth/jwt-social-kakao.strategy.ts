import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      // clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken, refreshToken, profile);
    return {
      email: profile._json.kakao_account.email,
      hashedPassword: '1234',
      name: profile.username,
      id: profile.id,
      phone_number: '01012341234',
      nickname: profile.displayName,
    };
  }
}
