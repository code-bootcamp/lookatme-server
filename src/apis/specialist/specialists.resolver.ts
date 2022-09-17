import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSpecialistInput } from './dto/createSpecialist.input';
import { Specialist } from './entities/specialist.entity';
import { SpecialistService } from './specialists.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { UpdateSpecialistInput } from './dto/updateSpecialist.input';
import { UseGuards } from '@nestjs/common';
import {
  GqlAuthAccessGuard,
  GqlAuthAdminAccessGuard,
  GqlAuthSpecialistAccessGuard,
} from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class SpecialistResolver {
  constructor(
    private readonly specialistService: SpecialistService, //
  ) {}

  @Query(() => [Specialist], { description: '전문가 전체 목록 조회' })
  async fetchSpecialists(
    @Args({ name: 'page', type: () => Int, nullable: true }) page?: number,
  ) {
    return this.specialistService.findAll({ page });
  }

  @Query(() => Specialist, { description: '전문가 조회' })
  async fetchSpecialist(@Args('id') id: string) {
    return this.specialistService.findOneWithId({ id });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Query(() => Specialist, {
    description: '로그인한 전문가 자신의 프로필 조회',
  })
  async fetchLoginSpecialist(
    @Context() context: any, //
  ) {
    const specialistId = context.req.user.id;
    return await this.specialistService.findLoginSpecialist({ specialistId });
  }

  @Query(() => [Specialist], { description: '높은가격순 전문가 조회' })
  async fetchSpecialistByPrice(
    @Args({ name: 'page', type: () => Int, nullable: true }) page?: number,
  ) {
    return await this.specialistService.findAllByPrice({ page });
  }

  @Query(() => [Specialist], { description: '별점순 전문가 조회' })
  async fetchSpecialsitByRate(
    @Args({ name: 'page', type: () => Int, nullable: true }) page?: number,
  ) {
    return await this.specialistService.findAllByRate({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean, { description: '전문가 로그인 확인' })
  isSpecialist(
    @Context() context: IContext, //
  ) {
    return this.specialistService.isSpecialsit({
      specialist: context.req.user,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Specialist, { description: '전문가 등록' })
  async createSpecialist(
    @Args('createSpecialistInput') createSpecialistInput: CreateSpecialistInput,
  ) {
    const hashedPassword = await bcrypt.hash(
      createSpecialistInput.password,
      Number(process.env.HASH_SALT),
    );
    return await this.specialistService.create({
      hashedPassword,
      ...createSpecialistInput,
    });
  }

  @UseGuards(GqlAuthSpecialistAccessGuard)
  @Mutation(() => Specialist, { description: '전문가 자신의 정보 수정' })
  async updateSpecialistOwnProfile(
    @Context() context: any, //
    @Args('updateSpecialistInput') updateSpecialistInput: UpdateSpecialistInput,
  ) {
    const specialistId = context.req.user.id;
    return await this.specialistService.update({
      specialistId,
      updateSpecialistInput,
    });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '전문가 삭제' })
  deleteSpecialist(@Args('id') id: string) {
    return this.specialistService.delete({ id });
  }

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Boolean, { description: '전문가 계정 복구' })
  restoreSpecialist(@Args('id') id: string) {
    return this.specialistService.restore({ id });
  }
}
