import { Field, ObjectType } from '@nestjs/graphql';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';

@Entity()
@ObjectType()
export class SpecialistChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  message: string;

  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @ManyToOne(() => ChatRoom)
  @Field(() => ChatRoom)
  room: ChatRoom;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
