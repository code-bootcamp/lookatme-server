import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Story } from 'src/apis/story/entities/story.entity';

@Entity()
@ObjectType()
export class SpecialistComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isReported: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @JoinColumn()
  @ManyToOne(() => Story)
  @Field(() => Story)
  story: Story;
}
