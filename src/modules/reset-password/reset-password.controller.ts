import { Controller, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { ChangePasswordSwagger } from '~/common/swagger/reset-password/change-password.swagger';
import { ForgotPassWordSwagger } from '~/common/swagger/reset-password/forgot-password.swagger';
import { SendEmailPassWordSwagger } from '~/common/swagger/reset-password/send-password.swagger';

@Controller()
@ApiTags('Reset Password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('sendEmailForgotPassword')
  @ApiOperation({ summary: 'Send email in case forgot password' })
  @ApiResponse({
    status: 201,
    description: 'New email sent with successfully',
    type: SendEmailPassWordSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
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
  @ApiOperation({ summary: 'Create new password through forgotten password' })
  @ApiResponse({
    status: 201,
    description: 'New email sent with successfully',
    type: ForgotPassWordSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['forgot_password']),
  )
  async resetForgotPassword(@Body() resetForgetPassword: ForgotPasswordDto) {
    await this.resetPasswordService.forgotPassword(resetForgetPassword);
    return { message: 'Success change your password' };
  }

  @Put('changePassword')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: 200,
    description: 'update password with successfully',
    type: ChangePasswordSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'role not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['change_password']),
  )
  resetPassword(@Body() changePassword: ChangePasswordDto) {
    return this.resetPasswordService.changePassword(changePassword);
  }
}
