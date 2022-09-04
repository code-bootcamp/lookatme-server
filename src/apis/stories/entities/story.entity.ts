import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/categories/entities/category.entity';
import { Comment } from 'src/apis/comments/entities/comment.entity';
import { SpecialistComment } from 'src/apis/specialistComments/entities/specialistComment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isReported: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

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

  @OneToMany(() => Category, (categories) => categories.story)
  @Field(() => [Category])
  categories: Category[];
}
