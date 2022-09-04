import { Field, ObjectType, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { Specialist } from 'src/apis/specialists/entities/specialist.entity';

@Entity()
@ObjectType()
export class SpecialistReview {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

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
