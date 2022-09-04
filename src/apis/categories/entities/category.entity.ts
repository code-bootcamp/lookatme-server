import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Story } from 'src/apis/stories/entities/story.entity';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  name: string;

  @JoinColumn()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;
}
