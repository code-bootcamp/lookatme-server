import { Field, ObjectType, Int } from '@nestjs/graphql';
import { SpecialistComment } from 'src/apis/specialistComment/entities/specialistComment.entity';
import { SpecialistReview } from 'src/apis/specialistReview/entities/specialistReview.entity';
import { Ticket } from 'src/apis/ticket/entities/ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @Field(() => String)
  account: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Field(() => String)
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  summary: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  @Field(() => String)
  imgUrl: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  introduction: string;

  @Column({ type: 'varchar', nullable: false })
  @Field(() => String)
  career: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  @Field(() => Int)
  price: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(
    () => SpecialistReview,
    (specialistReviews) => specialistReviews.specialist,
  )
  @Field(() => [SpecialistReview])
  specialistReviews: SpecialistReview[];

  @OneToMany(
    () => SpecialistComment,
    (specialistComments) => specialistComments.specialist,
  )
  @Field(() => [SpecialistComment])
  specialistComments: SpecialistComment[];

  @OneToMany(() => Ticket, (tickets) => tickets.specialist)
  @Field(() => [Ticket])
  tickets: Ticket[];
}
