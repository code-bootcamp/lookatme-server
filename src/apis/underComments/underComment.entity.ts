import { Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpecialistComment } from '../specialistComments/entities/specialistComment.entity';
import { User } from '../users/entities/user.entity';

@Entity()
export class UnderSpecialistComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => SpecialistComment)
  @Field(() => SpecialistComment)
  specialistComment: SpecialistComment;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
