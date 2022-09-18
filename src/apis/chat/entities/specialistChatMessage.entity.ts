import { Field, ObjectType } from '@nestjs/graphql';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';
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
export class SpecialistChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  message: string;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @JoinColumn()
  @ManyToOne(() => Ticket)
  @Field(() => Ticket)
  ticket: Ticket;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
