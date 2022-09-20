import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as coolsms from 'coolsms-node-sdk';
import * as nodemailer from 'nodemailer';
import { getToday } from 'src/commons/libraries/utills';
import { UnderSpecialistComment } from '../underSpecialistComment/entities/underSpecialistComment.entity';
import { Story } from '../story/entities/story.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Comment } from '../comment/entities/comment.entity';
import { UnderComment } from '../underComment/entity/underComment.entity';
import { StoryImage } from '../storyImage/entities/storyImage.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(UnderSpecialistComment)
    private readonly underSpecialistCommentRepository: Repository<UnderSpecialistComment>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(UnderComment)
    private readonly underCommentRepository: Repository<UnderComment>,

    @InjectRepository(StoryImage)
    private readonly storyImageRepository: Repository<StoryImage>,
  ) {}

  findAll({ page }) {
    return this.userRepository.find({
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findOneWithEmail({ email }) {
    const result = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!result)
      throw new UnprocessableEntityException(
        '존재하지 않는 user_email값 입니다.',
      );

    return result;
  }

  async findOneWithPhoneNumber({ phone_number }) {
    const result = await this.userRepository.findOne({
      where: { phone_number: phone_number },
    });

    if (!result)
      throw new UnprocessableEntityException(
        '존재하지 않는 user_phone_number값 입니다.',
      );

    return result;
  }

  async findOneWithId({ userId }) {
    const result = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!result)
      throw new UnprocessableEntityException('존재하지 않는 user_id값 입니다.');

    return result;
  }

  findWithDeleted({ page }) {
    return this.userRepository.find({
      withDeleted: true,
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async isUser({ user }) {
    const result = await this.userRepository.findOne({
      where: { id: user.id, email: user.email },
    });

    return result ? true : false;
  }

  async findOwnLikedStories({ user, page }) {
    const result = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['likedStories'],
    });

    if (!result)
      throw new UnprocessableEntityException('존재하지 않는 계정입니다.');

    return page
      ? result.likedStories.slice((page - 1) * 10, page * 10)
      : result.likedStories;
  }

  async create({ hashedPassword: password, ...createUserInput }) {
    const { ...user } = createUserInput;

    const uniqueEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (uniqueEmail) throw new ConflictException('이미 등록된 이메일 입니다.');

    const uniqueNickname = await this.userRepository.findOne({
      where: { nickname: user.nickname },
    });

    if (uniqueNickname)
      throw new ConflictException('이미 등록된 닉네임 입니다.');

    const uniquePhoneNumber = await this.userRepository.findOne({
      where: { phone_number: user.phone_number },
    });

    if (uniquePhoneNumber)
      throw new ConflictException('이미 등록된 전화번호 입니다.');

    const result = await this.userRepository.save({
      ...user,
      password,
    });

    return result;
  }

  async updateWithAdminAccess({ userId, updateUserWithAdminAccessInput }) {
    const { ...user } = updateUserWithAdminAccessInput;

    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    const result = await this.userRepository.save({
      ...myuser,
      id: userId,
      ...user,
    });

    return result;
  }

  async update({ user, updateUserInput }) {
    const myuser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    const result = await this.userRepository.save({
      ...myuser,
      id: user.id,
      ...updateUserInput,
    });

    return result;
  }

  async updatePwd({ userId, password }) {
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    const result = this.userRepository.save({
      ...myuser,
      id: userId,
      password,
    });

    return result;
  }

  async delete({ userId }) {
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['comments', 'likedStories', 'likedComments', 'stories'],
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    await this.ticketRepository.delete({ user: myuser });

    const storiesId = myuser.stories.map((ele) => ele.id);
    const commentsId = myuser.comments.map((ele) => ele.id);

    await Promise.all(
      storiesId.map((ele) =>
        this.storyImageRepository.delete({ story: { id: ele } }),
      ),
    );

    await Promise.all(
      commentsId.map((ele) => this.commentRepository.delete({ id: ele })),
    );

    await this.underSpecialistCommentRepository.delete({
      user: myuser,
    });

    await this.underCommentRepository.delete({
      user: myuser,
    });

    await Promise.all(
      storiesId.map((ele) => this.storyRepository.delete({ id: ele })),
    );

    const result = await this.userRepository.delete({
      id: userId,
    });

    return result.affected ? true : false;
  }

  getToken() {
    return String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
  }

  async sendToken({ phone_number, token }) {
    const mysms = coolsms.default;
    const messageService = new mysms(
      process.env.SMS_KEY,
      process.env.SMS_SECRET,
    );

    return await messageService.sendOne({
      to: phone_number,
      from: process.env.SMS_SENDER,
      text: `[LookAtMe] 요청하신 인증번호는 [${token}] 입니다.`,
      autoTypeDetect: true,
    });
  }

  getWelcomeTemplate({ nickname }) {
    return `
    <html>
        <body>
            <div style="height="100%" display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:500px; background-color: #73c7a9;">
                    <img
                    width="100%"
                    src="https://storage.googleapis.com/lookatme-storage/2022/9/17/f5131c44-17c6-4f47-9d46-4f6c284d80a4/origin/look_at_me.png"
                    alt="banner"
                    />
                </div>
                <div style="width:500px;">
                    <h1>${nickname}님 가입을 환영합니다!!!</h1>
                    <hr />
                    <div>가입일: ${getToday()}</div>
                </div>
            </div>
        </body>
    </html>
    `;
  }

  async sendTemplate({ email, template }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: '[LookAtMe] 가입을 축하합니다!',
      html: template,
    });
  }

  async updatePoint({ userId, amount, isSum }) {
    const user = await this.findOneWithId({ userId });

    return this.userRepository.save({
      ...user,
      id: user.id,
      point: isSum ? user.point + amount : user.point - amount,
    });
  }
}
