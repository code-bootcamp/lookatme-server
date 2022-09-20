import { Field, ObjectType, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';

@Entity()
@ObjectType()
export class SpecialistReview {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  @Field(() => String)
  text: string;

  @Column({ type: 'float', nullable: false })
  @Field(() => Float)
  rate: number;

  @CreateDateColumn()
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @JoinColumn()
  @OneToOne(() => Ticket, { onDelete: 'CASCADE' })
  @Field(() => Ticket)
  ticket: Ticket;
}
