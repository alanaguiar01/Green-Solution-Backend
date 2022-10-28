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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { CreateProfileSwagger } from '~/common/swagger/profile/create-profile.swagger';
import { IndexProfileSwagger } from '~/common/swagger/profile/index-profile.swagger';
import { ShowProfileSwagger } from '~/common/swagger/profile/show-profile.swagger';
import { UpdateProfileSwagger } from '~/common/swagger/profile/update-profile.swagger';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Add new profile to user' })
  @ApiResponse({
    status: 201,
    description: 'New profile added to user with success',
    type: CreateProfileSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['create_profile']),
  )
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all profiles' })
  @ApiResponse({
    status: 200,
    description: 'List all profile successfully returned',
    type: IndexProfileSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_profile']),
  )
  findAll() {
    return this.profileService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'List one profile of user' })
  @ApiResponse({
    status: 200,
    description: 'Profile of user successfully returned',
    type: ShowProfileSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_profile']),
  )
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update profile of user' })
  @ApiResponse({
    status: 200,
    description: 'update profile with successfully',
    type: UpdateProfileSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task não foi encontrada',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_profile']),
  )
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete('delete-profile/:id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_profile']),
  )
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
