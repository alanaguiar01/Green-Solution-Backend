import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-strategy.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.singUp(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req) {
    return this.authService.signIn(req.user);
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
