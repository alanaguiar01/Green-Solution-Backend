import { Controller, Post, Body, Put } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller()
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('sendEmailForgotPassword')
  async forgotPassword(@Body() email: CreateResetPasswordDto) {
    return await this.resetPasswordService.sendEmailForgotPassword(email);
  }

  @Post('forgotPassword')
  async resetForgotPassword(@Body() resetForgetPassword: ForgotPasswordDto) {
    await this.resetPasswordService.forgotPassword(resetForgetPassword);
    return { message: 'Success change your password' };
  }

  @Put('changePassword')
  resetPassword(@Body() changePassword: ChangePasswordDto) {
    return this.resetPasswordService.changePassword(changePassword);
  }
}
