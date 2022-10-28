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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { CreatePermissionSwagger } from '~/common/swagger/permission/create-permission.swagger';
import { IndexPermissionSwagger } from '~/common/swagger/permission/index-permission.swagger';
import { ShowPermissionSwagger } from '~/common/swagger/permission/show-permission.swagger';
import { UpdatePermissionSwagger } from '~/common/swagger/permission/update-permission.swagger';

@Controller('permissions')
@ApiTags('Permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add new Permission' })
  @ApiResponse({
    status: 201,
    description: 'Permissions created successfully',
    type: CreatePermissionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  // @UseGuards(
  //   RoleGuard(['creator', 'manager', 'employer']),
  //   PermissionGuard(['create_permission']),
  // )
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  @ApiResponse({
    status: 200,
    description: 'List Permissions successfully returned',
    type: IndexPermissionSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_permission']),
  )
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'List one permission of role' })
  @ApiResponse({
    status: 200,
    description: 'List one permission of role successfully returned',
    type: ShowPermissionSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task não foi encontrada',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_permission']),
  )
  findOne(@Param('name') name: string) {
    return this.permissionsService.findOne(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one permission' })
  @ApiResponse({
    status: 200,
    description: 'Permission update with successfully',
    type: UpdatePermissionSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Pemission invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
    type: NotFoundSwagger,
  })
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
