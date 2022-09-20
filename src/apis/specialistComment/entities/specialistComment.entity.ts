import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Story } from 'src/apis/story/entities/story.entity';
import { UnderSpecialistComment } from 'src/apis/underSpecialistComment/entities/underSpecialistComment.entity';

@Entity()
@ObjectType()
export class SpecialistComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext', nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isReported: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @JoinColumn()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;

  @OneToMany(
    () => UnderSpecialistComment,
    (underSpecialistComments) => underSpecialistComments.specialistComment,
  )
  @Field(() => [UnderSpecialistComment])
  underSpecialistComments: UnderSpecialistComment[];
}
