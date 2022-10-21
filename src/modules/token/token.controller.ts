import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import PermissionGuard from '~/guards/permission.guard';
import RoleGuard from '~/guards/role.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_token']),
  )
  @Put('refresh')
  refreshToken(@Body() data: RefreshTokenDto) {
    return this.tokenService.refreshToken(data.oldToken);
  }
}
