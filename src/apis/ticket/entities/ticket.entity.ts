import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessage } from 'src/apis/chat/entities/chatMessage.entity';
import { SpecialistChatMessage } from 'src/apis/chat/entities/specialistChatMessage.entity';
import { Specialist } from 'src/apis/specialist/entities/specialist.entity';
import { SpecialistReview } from 'src/apis/specialistReview/entities/specialistReview.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  @Field(() => Date)
  expired: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  used: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  @Field(() => Boolean)
  refunded: boolean;

  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Specialist)
  @Field(() => Specialist)
  specialist: Specialist;

  @OneToMany(() => ChatMessage, (chatMessages) => chatMessages.ticket, {
    cascade: true,
  })
  @Field(() => [ChatMessage])
  chatMessages: ChatMessage[];

  @OneToMany(
    () => SpecialistChatMessage,
    (specialistChatMessages) => specialistChatMessages.ticket,
    { cascade: true },
  )
  @Field(() => [SpecialistChatMessage])
  specialistChatMessages: SpecialistChatMessage[];

  @OneToOne(
    () => SpecialistReview,
    (specialistReview) => specialistReview.ticket,
    { cascade: true },
  )
  @Field(() => SpecialistReview)
  specialistReview: SpecialistReview;
}
