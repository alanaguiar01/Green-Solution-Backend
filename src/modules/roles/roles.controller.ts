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
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { CreateRoleSwagger } from '~/common/swagger/role/create-role.swagger';
import { IndexRoleSwagger } from '~/common/swagger/role/index-role.swagger';
import { ShowRoleSwagger } from '~/common/swagger/role/show-role.swagger';
import { UpdateRoleSwagger } from '~/common/swagger/role/update-role.swagger';
import { CreateRolePermissionSwagger } from '~/common/swagger/role/create-role-permission.swagger';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new role' })
  @ApiResponse({
    status: 201,
    description: 'New role added successfully',
    type: CreateRoleSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({
    status: 200,
    description: 'List roles successfully returned',
    type: IndexRoleSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_role']),
  )
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':name')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['list_role']),
  )
  @ApiOperation({ summary: 'List one role successfully returned' })
  @ApiResponse({
    status: 200,
    description: 'List role successfully returned',
    type: ShowRoleSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task não foi encontrada',
    type: NotFoundSwagger,
  })
  findOne(@Param('name') name: string) {
    return this.rolesService.findOne(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({
    status: 200,
    description: 'update role with successfully',
    type: UpdateRoleSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'roles invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'role not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer']),
    PermissionGuard(['update_role']),
  )
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a role' })
  @ApiResponse({ status: 204, description: 'role removed with success' })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager']),
    PermissionGuard(['delete_role']),
  )
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post('createRolePermission/:roleId')
  @ApiResponse({
    status: 201,
    description: 'New role created successfully',
    type: CreateRolePermissionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  // @UseGuards(
  //   RoleGuard(['creator', 'manager']),
  //   PermissionGuard(['create_role_permission']),
  // )
  createRolePermission(
    @Body() { permissions }: RolePermissionsRequest,
    @Param('roleId') roleId: string,
  ) {
    return this.rolesService.createRolePermission({ roleId, permissions });
  }
}
