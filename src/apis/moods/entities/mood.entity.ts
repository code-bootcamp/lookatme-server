import { Field } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/etities/board.entity';
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Mood {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  name: string;

  @JoinTable()
  @ManyToMany(() => Board, (boards) => boards.moods)
  @Field(() => [Board])
  boards: Board[];
}
