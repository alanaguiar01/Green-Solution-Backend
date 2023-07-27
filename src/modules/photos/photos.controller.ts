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
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { CreatePhotoSwagger } from '~/common/swagger/photos/create-photos.swagger';
import { IndexPhotoSwagger } from '~/common/swagger/photos/index-photos.swagger';
import { ShowPhotoSwagger } from '~/common/swagger/photos/show-photos.swagger';
import { UpdatePhotoSwagger } from '~/common/swagger/photos/update-post.swagger';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Add new photo in post' })
  @ApiResponse({
    status: 201,
    description: 'New photo added successfully',
    type: CreatePhotoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['create_photo']),
  )
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all photos of posts' })
  @ApiResponse({
    status: 200,
    description: 'List photos successfully returned',
    type: IndexPhotoSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_photo']),
  )
  findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_photo']),
  )
  @ApiOperation({ summary: 'List one photo of post' })
  @ApiResponse({
    status: 200,
    description: 'List one photo successfully returned',
    type: ShowPhotoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found',
    type: NotFoundSwagger,
  })
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one photo of post' })
  @ApiResponse({
    status: 200,
    description: 'Photo update with successfully',
    type: UpdatePhotoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'update invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'update not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_photo']),
  )
  update(@Param('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete('delete/:id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_photo']),
  )
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}
