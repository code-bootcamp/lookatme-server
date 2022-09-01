import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { PAYMENT_ENUM } from 'src/commons/type/enum';

registerEnumType(PAYMENT_ENUM, {
  name: 'PAYMENT_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  impUid: string;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  amount: number;

  @Column({ type: 'enum', enum: PAYMENT_ENUM })
  @Field(() => PAYMENT_ENUM)
  status: PAYMENT_ENUM;

  @JoinTable()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
