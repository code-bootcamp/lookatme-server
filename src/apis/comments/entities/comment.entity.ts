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
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Story } from 'src/apis/stories/entities/story.entity';

@Entity()
@ObjectType()
export class Comment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

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
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;
}
