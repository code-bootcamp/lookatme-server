import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSpecialistInput } from './dto/createSpecialist.input';
import { Specialist } from './entities/specialist.entity';
import { SpecialistService } from './specialists.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { UpdateSpecialistInput } from './dto/updateSpecialist.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAdminAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class SpecialistResolver {
  constructor(
    private readonly specialistService: SpecialistService, //
  ) {}

  @Query(() => [Specialist], { description: '전문가 전체 목록 조회' })
  async fetchSpecialists() {
    return this.specialistService.findAll();
  }

  @Query(() => Specialist, { description: '전문가 조회' })
  async fetchSpecialist(@Args('id') id: string) {
    return this.specialistService.findOneWithId({ id });
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

  @UseGuards(GqlAuthAdminAccessGuard)
  @Mutation(() => Specialist, { description: '전문가 정보 수정' })
  async updateSpecialist(
    @Args('id') id: string,
    @Args('updateSpecialistInput') updateSpecialistInput: UpdateSpecialistInput,
  ) {
    return await this.specialistService.update({ id, updateSpecialistInput });
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
