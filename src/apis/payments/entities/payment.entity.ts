import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

@Entity()
@ObjectType()
export class Payment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  impUid: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  @Field(() => Int)
  amount: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  @Field(() => String)
  status: string;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
