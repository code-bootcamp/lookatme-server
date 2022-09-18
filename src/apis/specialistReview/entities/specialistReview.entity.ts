import { Field, ObjectType, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Max, Min } from 'class-validator';

@Entity()
@ObjectType()
export class SpecialistReview {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  // @Min(0)
  // @Max(5)
  @Column({ type: 'float', nullable: false })
  @Field(() => Float)
  rate: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;
}
