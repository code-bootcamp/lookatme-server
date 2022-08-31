import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Field(() => Int)
  @Column({ type: 'int', unsigned: true, nullable: false })
  price: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200, nullable: false })
  description: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100, nullable: true })
  img_url: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false, nullable: false })
  isSoldout: boolean;

  @DeleteDateColumn()
  deleteAt: Date;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
