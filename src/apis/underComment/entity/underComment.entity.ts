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
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
export class UnderComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext', nullable: false })
  @Field(() => String)
  contents: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isReported: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @JoinColumn()
  @ManyToOne(() => Comment)
  @Field(() => Comment)
  comment: Comment;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
