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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategorySwagger } from '~/common/swagger/category/create-category.swagger';
import { IndexCategorySwagger } from '~/common/swagger/category/index-category.swagger';
import { ShowCategorySwagger } from '~/common/swagger/category/show-category.swagger';
import { UpdateCategorySwagger } from '~/common/swagger/category/update-category.swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import PermissionGuard from '~/guards/permission.guard';
import RoleGuard from '~/guards/role.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Add new category in post' })
  @ApiResponse({
    status: 201,
    description: 'Category added with successfully',
    type: CreateCategorySwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['create_post']),
  )
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all category of post' })
  @ApiResponse({
    status: 200,
    description: 'List all successfully returned',
    type: IndexCategorySwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_post']),
  )
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List one category of post' })
  @ApiResponse({
    status: 200,
    description: 'List category one returned successfully',
    type: ShowCategorySwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_post']),
  )
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one category of post' })
  @ApiResponse({
    status: 200,
    description: 'Update category with successfully',
    type: UpdateCategorySwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Category invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_post']),
  )
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('delete-category/:id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_post']),
  )
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
