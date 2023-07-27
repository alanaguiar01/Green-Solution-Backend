import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}
  /**
   * It creates a random token, creates a new entry in the database with the email and token, and then
   * sends an email to the user with a link to reset their password
   * @param {CreateResetPasswordDto}  - email - the email address of the user who forgot their password
   * @returns The token is being returned.
   */
  async sendEmailForgotPassword({ email }: CreateResetPasswordDto) {
    const token = Math.random().toString(36).substring(2, 13);
    const createEmail = this.resetPasswordRepository.create({
      email,
      token,
    });

    if (!createEmail) {
      throw new HttpException('email or token not found', HttpStatus.NOT_FOUND);
    }
    const url = `http://localhost:3006/reset-password/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password',
      html: `Click <a href="${url}">here</a> to reset password`,
    });
    return this.resetPasswordRepository.save(createEmail);
  }

  /**
   * It takes a token, a new password, and a confirmation password, and if the passwords match, it
   * finds the user associated with the token, hashes the new password, and updates the user's password
   * @param {ForgotPasswordDto}  - token - the token that was sent to the user's email
   * @returns The userService.update method is being returned.
   */
  async forgotPassword({
    token,
    password,
    password_confirm,
  }: ForgotPasswordDto) {
    if (password != password_confirm) {
      throw new BadRequestException('passwords do not match');
    }
    const reset = await this.findOne(token);
    const email = reset.email;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashPassword = await argon2.hash(password);
    return this.userService.update(user.id, { password: hashPassword });
  }

  /**
   * It takes in a ChangePasswordDto, finds the user by id, checks if the old password is valid, hashes
   * the new password, and updates the user with the new password
   * @param {ChangePasswordDto}  - id - the id of the user
   * @returns The userService.update method is being returned.
   */
  async changePassword({ id, newPassword, oldPassword }: ChangePasswordDto) {
    const user = await this.userService.findOneById(id);
    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }
    const hashPassword = await argon2.hash(newPassword);
    return this.userService.update(id, { password: hashPassword });
  }

  /**
   * It finds a token in the database and if it doesn't find it, it throws an error
   * @param {string} token - The token that was sent to the user's email.
   * @returns The token found
   */
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
