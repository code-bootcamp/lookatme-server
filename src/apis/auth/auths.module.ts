import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtAdminAccessStrategy } from 'src/commons/auth/jwt-admin-access.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtSpecialistAccessStrategy } from 'src/commons/auth/jwt-specialist-access.strategy';
import { AdminsService } from '../admin/admins.service';
import { Admin } from '../admin/entities/admin.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Story } from '../story/entities/story.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { UnderSpecialistComment } from '../underSpecialistComment/entities/underSpecialistComment.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { AuthsController } from './auths.controller';
import { AuthsResolver } from './auths.resolver';
import { AuthsService } from './auths.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User, // usersSevice uses Product, User Repository
      Admin,
      Specialist,
      Story,
      Ticket,
      UnderSpecialistComment,
      Comment,
      UnderComment,
      StoryImage,
    ]),
  ],
  providers: [
    JwtSpecialistAccessStrategy,
    JwtAdminAccessStrategy, // declare location of provider doesn't matter
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
    JwtGoogleStrategy,
    AuthsResolver,
    AuthsService,
    UsersService,
    AdminsService,
  ],
  controllers: [
    AuthsController, //
  ],
})
export class AuthsModule {}
