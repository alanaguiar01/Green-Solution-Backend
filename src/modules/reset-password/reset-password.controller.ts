import { Controller, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import RoleGuard from 'src/guards/role.guard';
import PermissionGuard from 'src/guards/permission.guard';

@Controller()
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('sendEmailForgotPassword')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['send_email']),
  )
  async forgotPassword(@Body() email: CreateResetPasswordDto) {
    const forgotPassword =
      await this.resetPasswordService.sendEmailForgotPassword(email);
    return forgotPassword;
  }

  @Post('forgotPassword')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['forgot_password']),
  )
  async resetForgotPassword(@Body() resetForgetPassword: ForgotPasswordDto) {
    await this.resetPasswordService.forgotPassword(resetForgetPassword);
    return { message: 'Success change your password' };
  }

  @Put('changePassword')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['change_password']),
  )
  resetPassword(@Body() changePassword: ChangePasswordDto) {
    return this.resetPasswordService.changePassword(changePassword);
  }
}
