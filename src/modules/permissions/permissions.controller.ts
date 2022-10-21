import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('create')
  // @UseGuards(
  //   RoleGuard(['creator', 'manager', 'employer']),
  //   PermissionGuard(['create_permission']),
  // )
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get('all-permissions')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_permission']),
  )
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('one-permission/:name')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_permission']),
  )
  findOne(@Param('name') name: string) {
    return this.permissionsService.findOne(name);
  }

  @Patch(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['update_permission']),
  )
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['delete_permission']),
  )
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
