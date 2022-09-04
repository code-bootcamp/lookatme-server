import { Field, ObjectType } from '@nestjs/graphql';
import { Story } from 'src/apis/stories/entities/story.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StoryImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  url: string;

  @JoinTable()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;
}
