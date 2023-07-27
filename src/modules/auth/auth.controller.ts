import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserSwagger } from '~/common/swagger/auth/login-user.swagger';
import { CreateUserSwagger } from '~/common/swagger/auth/register-user.swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { LocalAuthGuard } from '~/guards/local-strategy.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CookieAuthGuard } from '~/guards/ws-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Add new user in api' })
  @ApiResponse({
    status: 201,
    description: 'New user added successfully',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.singUp(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Make login user' })
  @ApiResponse({
    status: 201,
    description: 'Login user return successfully',
    type: LoginUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(LocalAuthGuard)
  signin(@Request() req) {
    return this.authService.signIn(req.user);
  }
  @Get('cookie')
  @UseGuards(CookieAuthGuard)
  testRoute() {
    return 'Authenticated route';
  }
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
