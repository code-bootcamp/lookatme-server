import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Address {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  addressDetail: string;

  @Column({ type: 'char', length: 5, nullable: false })
  @Field(() => String)
  zipcode: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
