import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/etities/board.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BoardImage {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  url: string;

  @JoinColumn()
  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
