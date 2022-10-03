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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermissionsRequest } from './dto/role-permissions.dto';
import RoleGuard from 'src/guards/role1.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @UseGuards(RoleGuard(['creator']))
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('all-role')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.rolesService.findOne(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post('createRolePermission/:roleId')
  createRolePermission(
    @Body() { permissions }: RolePermissionsRequest,
    @Param('roleId') roleId: string,
  ) {
    return this.rolesService.createRolePermission({ roleId, permissions });
  }
}
