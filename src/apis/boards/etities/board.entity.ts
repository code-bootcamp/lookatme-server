import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Mood } from 'src/apis/moods/entities/mood.entity';
import { Tag } from 'src/apis/tags/entities/tag.entity';

@Entity()
@ObjectType()
export class Board {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  @Field(() => Int)
  like: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @Field(() => String)
  season: string;

  @Column({ type: 'boolean', nullable: false })
  @Field(() => Boolean)
  isMaker: boolean;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  contents: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToMany(() => User, (users) => users.savedBoards)
  @Field(() => [User])
  users: User[];

  @ManyToMany(() => Mood, (moods) => moods.boards)
  @Field(() => [Mood])
  moods: Mood[];

  @JoinColumn()
  @ManyToMany(() => Tag, (tags) => tags.boards)
  @Field(() => [Tag])
  tags: Tag[];
}
