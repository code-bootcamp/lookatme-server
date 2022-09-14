import { Field, ObjectType } from '@nestjs/graphql';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', unique: true })
  @Field(() => String)
  room: string;

  @OneToOne(() => Ticket)
  @Field(() => Ticket)
  ticket: Ticket;
}
