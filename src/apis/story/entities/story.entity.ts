import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/categories/entities/category.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { SpecialistComment } from 'src/apis/specialistComment/entities/specialistComment.entity';
import { StoryImage } from 'src/apis/storyImage/entities/storyImage.entity';
import { User } from 'src/apis/user/entities/user.entity';
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
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinTable()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => User, (likedusers) => likedusers.likedStories, {
    cascade: true,
  })
  @Field(() => [User])
  likedusers: User[];

  @OneToMany(() => Comment, (comments) => comments.story, { cascade: true })
  @Field(() => [Comment])
  comments: Comment[];

  @OneToMany(() => StoryImage, (storyImage) => storyImage.story, {
    cascade: true,
  })
  @Field(() => [StoryImage])
  storyImage: StoryImage[];

  @OneToMany(
    () => SpecialistComment,
    (specialistComments) => specialistComments.story,
    { cascade: true },
  )
  @Field(() => [SpecialistComment])
  specialistComments: SpecialistComment[];

  @JoinColumn()
  @ManyToOne(() => Category)
  @Field(() => Category)
  category: Category;
}
