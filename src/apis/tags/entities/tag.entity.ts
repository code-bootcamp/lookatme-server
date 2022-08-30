import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Tag {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ManyToMany(() => Board, (boards) => boards.tags)
  @Field(() => [Board])
  boards: Board[];
}
