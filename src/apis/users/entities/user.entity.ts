import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { GenderDefault } from 'src/commons/type/enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

registerEnumType(GenderDefault, {
  name: 'GenderDefault',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  @Field(() => String)
  nickname: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @Field(() => String)
  phone_number: string;

  @Column({ type: 'enum', enum: GenderDefault })
  @Field(() => GenderDefault)
  gender: GenderDefault;

  @Column({ type: 'int', unsigned: true, nullable: false })
  @Field(() => Int)
  height: number;

  @Column({ type: 'int', unsigned: true, default: 0, nullable: false })
  @Field(() => Int)
  point: number;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  admin: boolean;

  @JoinTable()
  @ManyToMany(() => Board, (savedBoards) => savedBoards.users)
  @Field(() => [Board])
  savedBoards: Board[];
}
