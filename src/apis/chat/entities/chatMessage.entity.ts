import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
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
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'longtext' })
  @Field(() => String)
  message: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => ChatRoom)
  @Field(() => ChatRoom)
  room: ChatRoom;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
