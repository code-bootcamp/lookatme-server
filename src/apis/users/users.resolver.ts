import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUserInput';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import {
  CACHE_MANAGER,
  // ConflictException,
  // HttpException,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  ////////////////////Query/////////////////////////

  @UseGuards(GqlAuthAdminAccessGuard)
  @Query(() => [User], { description: '모든 회원 조회' })
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User, { description: '이메일로 회원 조회' })
  fetchUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.findOne({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User, { description: '로그인한 회원 정보 조회' })
  fetchLoginUser(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.usersService.findOne({ email });
  }

  @Query(() => [User], { description: '삭제된 회원도 같이 조회' })
  fetchUsersWithDeleted() {
    return this.usersService.findWithDeleted();
  }

  ////////////////////Mutation/////////////////////////

  @Mutation(() => User, { description: '회원 가입 및 환영 이메일 전송' })
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    // 1. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      Number(process.env.HASH_SALT),
    );

    // 배포환경
    // 2. 가입환영 템플릿 만들기
    // const template = this.usersService.getWelcomeTemplate({
    //   nickname: createUserInput.nickname,
    // });

    // 3. 이메일에 가입환영 템플릿 전송하기
    // try {
    //   await this.usersService.sendTemplate({
    //     email: createUserInput.email,
    //     template,
    //   });
    // } catch (error) {
    //   throw new HttpException(
    //     error.response.message, //
    //     error.status,
    //   );
    // }

    // 4. 회원 생성
    return this.usersService.create({
      hashedPassword,
      ...createUserInput,
    });
  }

  @Mutation(() => User, { description: '회원정보 수정' })
  updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({ userId, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User, { description: '회원 비밀번호 변경' })
  async updateUserPwd(
    @Context() context: any, //
    @Args('newPassword') newPassword: string,
  ) {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne({
      email: context.req.user.email,
    });

    // 2. 비밀번호가 같으면
    const isAuth = await bcrypt.compare(newPassword, user.password);
    if (isAuth) throw new UnprocessableEntityException('기존 비밀번호 입니다');

    const userId = context.req.user.id;
    const password = await bcrypt.hash(
      newPassword,
      Number(process.env.HASH_SALT),
    );

    // 3. 새로운 비밀번호 설정
    return this.usersService.updatePwd({ userId, password });
  }

  @Mutation(() => Boolean, { description: '회원 삭제' })
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.delete({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, { description: '회원탈퇴' })
  deleteLoginUser(
    @Context() context: any, //
  ) {
    const userId = context.req.user.id;
    return this.usersService.delete({ userId });
  }

  @Mutation(() => Boolean, { description: '삭제된 회원 복구' })
  restoreUser(@Args('userId') userId: string) {
    return this.usersService.undoDelete({ userId });
  }

  @Mutation(() => String, { description: '토큰 보내기' })
  async sendTokenToSMS(@Args('phone_number') phone_number: string) {
    const token = this.usersService.getToken();
    // 배포환경
    // const result = await this.usersService.sendToken({ phone_number, token });

    // in 3mins
    await this.cacheManager.set(token, phone_number, {
      ttl: 180,
    });

    // 개발환경
    return `phone:${phone_number} token:${token}`;

    // 배포환경
    // if (result.statusCode === '2000')
    //   // succeed
    //   return `phone:${phone_number} token:${token}`;
    // else return `${result.statusCode}: ${result.statusMessage}`;
  }

  @Mutation(() => Boolean, { description: '토큰 확인' })
  async checkToken(@Args('token') token: string) {
    const tokenCache = await this.cacheManager.get(token);

    return tokenCache ? true : false;
  }
}
