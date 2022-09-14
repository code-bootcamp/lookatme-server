import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  author: string;

  @Column({ type: 'longtext', nullable: false })
  @Field(() => String)
  message: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  isSelected: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
