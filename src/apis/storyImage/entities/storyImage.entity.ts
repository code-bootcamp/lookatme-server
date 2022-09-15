import { Field, ObjectType } from '@nestjs/graphql';
import { Story } from 'src/apis/story/entities/story.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StoryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  url: string;

  @JoinColumn()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;
}
