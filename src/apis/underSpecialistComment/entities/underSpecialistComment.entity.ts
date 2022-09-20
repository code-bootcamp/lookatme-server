import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpecialistComment } from '../../specialistComment/entities/specialistComment.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
export class UnderSpecialistComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext', nullable: false })
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => SpecialistComment)
  @Field(() => SpecialistComment)
  specialistComment: SpecialistComment;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
