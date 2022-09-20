import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Story } from 'src/apis/story/entities/story.entity';
import { UnderComment } from 'src/apis/underComment/entity/underComment.entity';

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

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @Field(() => Story)
  story: Story;

  @JoinTable()
  @ManyToMany(() => User, (likedUsers) => likedUsers.likedComments)
  @Field(() => [User])
  likedUsers: User[];

  @OneToMany(() => UnderComment, (underComments) => underComments.comment, {
    cascade: true,
  })
  @Field(() => [UnderComment])
  underComments: UnderComment[];
}
