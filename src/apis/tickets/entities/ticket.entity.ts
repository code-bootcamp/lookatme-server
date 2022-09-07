import { Field, ObjectType } from '@nestjs/graphql';
import { ChatRoom } from 'src/apis/chat/entities/chatRoom.entity';
import { Specialist } from 'src/apis/specialists/entities/specialist.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  @Field(() => Date)
  expired: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  used: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  refunded: boolean;

  @JoinColumn()
  @OneToOne(() => ChatRoom)
  @Field(() => ChatRoom)
  chatRoom: ChatRoom;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;
}
