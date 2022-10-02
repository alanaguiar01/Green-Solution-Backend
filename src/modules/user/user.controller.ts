import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { UserACLRequest } from './dto/user-acl-request.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('acl')
  accessUserControl(@Body() userACLRequest: UserACLRequest) {
    return this.userService.CreateUserAccessControlListService(userACLRequest);
  }
}
