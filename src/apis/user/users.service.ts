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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
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

  findWithDeleted() {
    return this.userRepository.find({
      withDeleted: true,
    });
  }

  async isUser({ user }) {
    const result = await this.userRepository.findOne({
      where: { id: user.id, email: user.email },
    });

    return result ? true : false;
  }

  async create({ hashedPassword: password, ...createUserInput }) {
    const { ...user } = createUserInput;

    // 1. check if user email exist on User table
    const uniqueEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (uniqueEmail) throw new ConflictException('이미 등록된 이메일 입니다.');

    // 2. check if user nickname exist on User table
    const uniqueNickname = await this.userRepository.findOne({
      where: { nickname: user.nickname },
    });

    if (uniqueNickname)
      throw new ConflictException('이미 등록된 닉네임 입니다.');

    // 3. check if user phone_number exist on User table
    const uniquePhoneNumber = await this.userRepository.findOne({
      where: { phone_number: user.phone_number },
    });

    if (uniquePhoneNumber)
      throw new ConflictException('이미 등록된 전화번호 입니다.');

    // 4. save user
    const result = await this.userRepository.save({
      ...user,
      password,
    });

    // 5. return user object
    return result;
  }

  async updateWithAdminAccess({ userId, updateUserWithAdminAccessInput }) {
    const { ...user } = updateUserWithAdminAccessInput;

    // 1. find user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. save new user
    const result = await this.userRepository.save({
      ...myuser,
      id: userId,
      ...user,
    });

    // 4. return user object
    return result;
  }

  async update({ user, updateUserInput }) {
    // 1. find user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. save new user
    const result = await this.userRepository.save({
      ...myuser,
      id: user.id,
      ...updateUserInput,
    });

    // 4. return user object
    return result;
  }

  async updatePwd({ userId, password }) {
    // 1. fine user from User table with user_id
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. replace new password with old password
    const result = this.userRepository.save({
      ...myuser,
      id: userId,
      password,
    });

    return result;
  }

  async delete({ userId }) {
    // 1. fine user
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!myuser)
      throw new UnprocessableEntityException('존재하지 않는 user_id 입니다');

    // 2. softdelte user
    const result = await this.userRepository.softDelete({
      id: userId,
    });

    return result.affected ? true : false;
  }

  async undoDelete({ userId }) {
    // 1. fine user
    const myuser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
      withDeleted: true,
    });

    if (!myuser)
      throw new UnprocessableEntityException(
        '삭제 목록에 존재하지 않는 user_id 입니다',
      );

    // 2. restore user
    const result = await this.userRepository.restore({
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
            <div style="display: flex; flex-direction: column; align-items: center;">
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
}
