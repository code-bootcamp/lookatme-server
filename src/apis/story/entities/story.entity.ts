import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/categories/entities/category.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { SpecialistComment } from 'src/apis/specialistComment/entities/specialistComment.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: false })
  @Field(() => Int)
  likes: number;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: false })
  @Field(() => Int)
  commentCounts: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isReported: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => User, (likedusers) => likedusers.likedStories)
  @Field(() => [User])
  likedusers: User[];

  @OneToMany(() => Comment, (comments) => comments.story)
  @Field(() => [Comment])
  comments: Comment[];

  @OneToMany(
    () => SpecialistComment,
    (specialistComments) => specialistComments.story,
  )
  @Field(() => [SpecialistComment])
  specialistComments: SpecialistComment[];

  @JoinColumn()
  @ManyToOne(() => Category)
  @Field(() => Category)
  category: Category;
}
