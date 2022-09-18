import { Field, ObjectType } from '@nestjs/graphql';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  message: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Ticket)
  @Field(() => Ticket)
  ticket: Ticket;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
