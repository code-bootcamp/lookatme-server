import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import {
  UpdateUserInput,
  UpdateUserWithAdminAccessInput,
} from './dto/updateUser.Input';
import { IContext } from 'src/commons/type/context';
import { Story } from '../story/entities/story.entity';

/**
 *  Description : API docs for user setting
 *  Constructor : UsersService, Cache
 *  Content :
 *    [ Query ]
 *      fetchUsers
 *            [ page: Int => [User] ]
 *              : 모든 회원 조회 API
 *      fetchUserWithEmail
 *            [ email: String => User ]
 *              : 이메일로 회원 조회 API
 *      fetchUserWithPhoneNumber
 *            [ phoneNumber: String => User]
 *              : 전화번호로 회원 조회 API
 *      fetchLoginUser
 *            [ context: any => User ]
 *              : 로그인한 회원 정보 조회 API
 *      fetchUsersWithDeleted
 *            [ page: Int => [User] ]
 *              : 삭제된 회원도 같이 조회 API
 *      isUser
 *            [ context: IContext => Boolean ]
 *              : 회원으로 로그인했는지 확인 API
 *      fetchOwnLikedStories
 *            [ context: IContext, page: Int => [Story] ]
 *              : 회원이 좋아요 누른 사연 조회 API
 *    [ Mutation ]
 *      createUser
 *            [ createUserInput: CreateUserInput => User ]
 *              : 회원 가입 및 환영 이메일 전송 API
 *      updateUserWithAdminAccess
 *            [ userId: String, updateUserWithAdminAccessInput: ㅕpdateUserWithAdminAccessInput => User ]
 *              : 관리자 권한으로 회원정보 수정 API
 *      updateUserPwd
 *            [ context: any, newPassword: String => User ]
 *              : 로그인한 회원 비밀번호 변경 API
 *      updateUserPwdWithEmail
 *            [ email: String, newPassword: String => User ]
 *              : 이메일로 회원 비밀번호 변경 API
 *      updateUser
 *            [ context: any, updateUserInput: UpdateUserInput => User ]
 *              : 로그인한 회원 정보 변경 APi
 *      deleteUser
 *            [ userId: String => Boolean ]
 *              : 관리자 권한으로 회원 삭제 APi
 *      deleteLoginUser
 *            [ context: any => Boolean ]
 *              : 로그인한 회원 탈퇴 APi
 *      restoreUser
 *            [ userId: String => Boolean ]
 *              : 관리자 권한으로 삭제된 회원 복구 API
 *      sendTokenToSMS
 *            [ phoneNumber: String => String ]
 *              : 토큰 보내기 API
 *      checkToken
 *            [ token: String, phoneNumber: String => Boolean ]
 *              : 토큰 확인 API
 *      updateUserPoint
 *            [ userId: String, amount: Int, isSum: Boolean => User ]
 *              : 무료 포인트 지급 API
 */

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [User], { description: '모든 회원 조회' })
  fetchUsers(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.usersService.findAll({ page });
  }

  @Query(() => User, { description: '이메일로 회원 조회' })
  fetchUserWithEmail(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOneWithEmail({ email });
  }

  @Query(() => User, { description: '전화번호로 회원 조회' })
  fetchUserWithPhoneNumber(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    return this.usersService.findOneWithPhoneNumber({
      phone_number: phoneNumber,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User, { description: '로그인한 회원 정보 조회' })
  fetchLoginUser(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.usersService.findOneWithEmail({ email });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [User], { description: '삭제된 회원도 같이 조회' })
  fetchUsersWithDeleted(
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.usersService.findWithDeleted({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean, { description: '회원 로그인 확인' })
  isUser(
    @Context() context: IContext, //
  ) {
    return this.usersService.isUser({ user: context.req.user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Story], { description: '회원이 좋아요 누른 사연 조회' })
  fetchOwnLikedStories(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int }) page: number, //
  ) {
    return this.usersService.findOwnLikedStories({
      user: context.req.user,
      page,
    });
  }

  @Mutation(() => User, { description: '회원 가입 및 환영 이메일 전송' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      Number(process.env.HASH_SALT),
    );

    const template = this.usersService.getWelcomeTemplate({
      nickname: createUserInput.nickname,
    });

    try {
      await this.usersService.sendTemplate({
        email: createUserInput.email,
        template,
      });
    } catch (error) {
      throw new HttpException(
        error.response.message, //
        error.status,
      );
    }

    return this.usersService.create({
      hashedPassword,
      ...createUserInput,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => User, { description: '관리자 권한으로 회원정보 수정' })
  updateUserWithAdminAccess(
    @Args('userId') userId: string,
    @Args('updateUserWithAdminAccessInput')
    updateUserWithAdminAccessInput: UpdateUserWithAdminAccessInput,
  ) {
    return this.usersService.updateWithAdminAccess({
      userId,
      updateUserWithAdminAccessInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User, { description: '로그인한 회원 비밀번호 변경' })
  async updateUserPwd(
    @Context() context: any, //
    @Args('newPassword') newPassword: string,
  ) {
    const user = await this.usersService.findOneWithEmail({
      email: context.req.user.email,
    });

    const isAuth = await bcrypt.compare(newPassword, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');

    const password = await bcrypt.hash(
      newPassword,
      Number(process.env.HASH_SALT),
    );

    return this.usersService.updatePwd({
      userId: context.req.user.id,
      password,
    });
  }

  @Mutation(() => User, { description: '이메일로 회원 비밀번호 변경' })
  async updateUserPwdWithEmail(
    @Args('email') email: string, //
    @Args('newPassword') newPassword: string,
  ) {
    const user = await this.usersService.findOneWithEmail({
      email,
    });

    const isAuth = await bcrypt.compare(newPassword, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');

    const password = await bcrypt.hash(
      newPassword,
      Number(process.env.HASH_SALT),
    );

    return this.usersService.updatePwd({ userId: user.id, password });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User, { description: '로그인한 회원 정보 변경' })
  updateUser(
    @Context() context: any, //
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({
      user: context.req.user,
      updateUserInput,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '관리자 권한으로 회원 삭제' })
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.delete({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '로그인한 회원 탈퇴' })
  deleteLoginUser(
    @Context() context: any, //
  ) {
    const userId = context.req.user.id;
    return this.usersService.delete({ userId });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '관리자 권한으로 삭제된 회원 복구' })
  restoreUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.undoDelete({ userId });
  }

  @Mutation(() => String, { description: '토큰 보내기' })
  async sendTokenToSMS(
    @Args('phoneNumber') phoneNumber: string, //
  ) {
    const token = this.usersService.getToken();
    // 배포환경
    const result = await this.usersService.sendToken({
      phone_number: phoneNumber,
      token,
    });

    await this.cacheManager.set(token, phoneNumber, {
      ttl: 180,
    });

    // 개발환경
    // return `phone:${phoneNumber} token:${token}`;

    // 배포환경
    if (result.statusCode === '2000')
      return `phone:${phoneNumber} token:${token}`;
    else return `${result.statusCode}: ${result.statusMessage}`;
  }

  @Mutation(() => Boolean, { description: '토큰 확인' })
  async checkToken(
    @Args('token') token: string, //
    @Args('phoneNumber') phoneNumber: string,
  ) {
    const tokenCache = await this.cacheManager.get(token);

    return tokenCache ? tokenCache === phoneNumber : false;
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => User, { description: '무료 포인트 지급' })
  updateUserPoint(
    @Args('userId') userId: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Args('isSum') isSum: boolean,
  ) {
    return this.usersService.updatePoint({ userId, amount, isSum });
  }
}
