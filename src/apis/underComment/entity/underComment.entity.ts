import { Field, ObjectType } from '@nestjs/graphql';
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
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
export class UnderComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
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

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => Comment)
  @Field(() => Comment)
  comment: Comment;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
