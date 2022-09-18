import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Story } from 'src/apis/story/entities/story.entity';

@Entity()
@ObjectType()
export class Comment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'longtext', nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: false })
  @Field(() => Int)
  likes: number;

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

  @JoinTable()
  @ManyToMany(() => User, (likedUsers) => likedUsers.likedComments)
  @Field(() => [User])
  likedUsers: User[];
}
