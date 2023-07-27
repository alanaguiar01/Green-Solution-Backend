import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { UpdateTokenSwagger } from '~/common/swagger/token/update-token.swagger';
import PermissionGuard from '~/guards/permission.guard';
import RoleGuard from '~/guards/role.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenService } from './token.service';

@Controller('token')
@ApiTags('Token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_token']),
  )
  @ApiOperation({ summary: 'Update token of user' })
  @ApiResponse({
    status: 200,
    description: 'Token updated successfully',
    type: UpdateTokenSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Data invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
    type: NotFoundSwagger,
  })
  @Put('refresh')
  refreshToken(@Body() data: RefreshTokenDto) {
    return this.tokenService.refreshToken(data.oldToken);
  }
}
