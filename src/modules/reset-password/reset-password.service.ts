import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPassword } from './entities/reset-password.entity';
import * as argon2 from 'argon2';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject('RESETPASSWORD_REPOSITORY')
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}
  async sendEmailForgotPassword({ email }: CreateResetPasswordDto) {
    const token = Math.random().toString(36).substring(2, 13);
    const createEmail = this.resetPasswordRepository.create({
      email,
      token,
    });

    if (!createEmail) {
      throw new HttpException('email or token not found', HttpStatus.NOT_FOUND);
    }
    const url = `http://localhost:4200/forgotPassword/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password',
      html: `Click <a href="${url}">here</a> to reset password`,
    });
    return this.resetPasswordRepository.save(createEmail);
  }

  async forgotPassword({
    token,
    confirm_password,
    new_password,
  }: ForgotPasswordDto) {
    if (new_password !== confirm_password) {
      throw new BadRequestException('passwords do not match');
    }
    const reset = await this.findOne(token);
    const email = reset.email;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashPassword = await argon2.hash(new_password);
    return this.userService.update(user.id, { password: hashPassword });
  }

  async changePassword({ id, newPassword, oldPassword }: ChangePasswordDto) {
    const user = await this.userService.findOneById(id);
    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }
    const hashPassword = await argon2.hash(newPassword);
    return this.userService.update(id, { password: hashPassword });
  }

  findOne(token: string) {
    const tokenFound = this.resetPasswordRepository.findOne({
      where: { token },
    });
    if (!tokenFound) {
      throw new BadRequestException('token not found');
    }
    return tokenFound;
  }
}
