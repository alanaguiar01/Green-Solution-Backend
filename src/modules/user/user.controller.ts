import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import PermissionGuard from 'src/guards/permission.guard';
import RoleGuard from 'src/guards/role.guard';
import { UserACLRequest } from './dto/user-acl-request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('allUsers')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_user']),
  )
  findAll() {
    return this.userService.findAll();
  }

  @Get('oneUser/:id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_user']),
  )
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Delete('deleteUser/:id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['delete']),
  )
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('acl')
  @UseGuards(RoleGuard(['creator', 'manager']))
  accessUserControl(@Body() userACLRequest: UserACLRequest) {
    return this.userService.CreateUserAccessControlListService(userACLRequest);
  }
}
