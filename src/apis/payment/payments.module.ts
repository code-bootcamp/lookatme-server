import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { IamportsService } from '../iamport/iamports.service';
import { Story } from '../story/entities/story.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { UnderSpecialistComment } from '../underSpecialistComment/entities/underSpecialistComment.entity';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      User,
      Story,
      Ticket,
      UnderSpecialistComment,
      Comment,
      UnderComment,
      StoryImage,
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    IamportsService,
    UsersService,
  ],
})
export class PaymentsModule {}
