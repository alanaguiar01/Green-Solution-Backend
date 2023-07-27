import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { CreateAccessControlListUserSwagger } from '~/common/swagger/user/create-access-list-user.swagger';
import { IndexUserSwagger } from '~/common/swagger/user/index-user.swagger';
import { ShowUserSwagger } from '~/common/swagger/user/show-user.swagger';
import { JwtAuthGuard } from '~/guards/jwt-auth.guard';
import PermissionGuard from '~/guards/permission.guard';
import RoleGuard from '~/guards/role.guard';
import { UserACLRequest } from './dto/user-acl-request.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return this.userService.findOneById(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all users of api' })
  @ApiResponse({
    status: 200,
    description: 'User list successfully returned',
    type: IndexUserSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_user']),
  )
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List one user of api' })
  @ApiResponse({
    status: 200,
    description: 'User data returned successfully',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_user']),
  )
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one users of api' })
  @ApiResponse({
    status: 204,
    description: 'User successfully removed',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['delete']),
  )
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('acl')
  @ApiOperation({ summary: 'Create access control list of users in api' })
  @ApiResponse({
    status: 201,
    description: 'Create Access Control List User data returned successfully',
    type: CreateAccessControlListUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  // @UseGuards(RoleGuard(['creator', 'manager']))
  accessUserControl(@Body() userACLRequest: UserACLRequest) {
    return this.userService.CreateUserAccessControlListService(userACLRequest);
  }
}
