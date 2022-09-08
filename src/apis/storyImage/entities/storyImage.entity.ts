import { ObjectType } from '@nestjs/graphql';
import { Story } from 'src/apis/story/entities/story.entity';
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
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  url: string;

  @JoinTable()
  @ManyToOne(() => Story)
  story: Story;
}
