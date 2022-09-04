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

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
