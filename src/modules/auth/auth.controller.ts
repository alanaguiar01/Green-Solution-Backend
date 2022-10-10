import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import PermissionGuard from 'src/guards/permission.guard';
import RoleGuard from 'src/guards/role.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.singUp(createUserDto);
  }

  @Post('signin')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['signin']),
  )
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
