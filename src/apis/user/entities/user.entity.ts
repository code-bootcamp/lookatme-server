import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { SpecialistReview } from 'src/apis/specialistReview/entities/specialistReview.entity';
import { Story } from 'src/apis/story/entities/story.entity';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  @Field(() => String)
  nickname: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @Field(() => String)
  phone_number: string;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: false })
  @Field(() => Int)
  point: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Story, (likedStories) => likedStories.likedusers)
  @Field(() => [Story])
  likedStories: Story[];

  @ManyToMany(() => Comment, (likedComments) => likedComments.likedUsers)
  @Field(() => [Comment])
  likedComments: Comment[];

  @OneToMany(() => Story, (stories) => stories.user)
  @Field(() => [Story])
  stories: Story[];

  @OneToMany(() => Ticket, (tickets) => tickets.user)
  @Field(() => [Ticket])
  tickets: Ticket[];

  @OneToMany(
    () => SpecialistReview,
    (specialistReviews) => specialistReviews.user,
  )
  @Field(() => [SpecialistReview])
  specialistReviews: SpecialistReview[];

  @OneToMany(() => Comment, (comments) => comments.user)
  @Field(() => [Comment])
  comments: Comment[];
}
