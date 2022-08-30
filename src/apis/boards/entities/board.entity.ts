import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
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

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
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

  @JoinTable()
  @ManyToMany(() => Mood, (moods) => moods.boards)
  @Field(() => [Mood])
  moods: Mood[];

  @JoinTable()
  @ManyToMany(() => Tag, (tags) => tags.boards)
  @Field(() => [Tag])
  tags: Tag[];
}
