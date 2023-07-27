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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexPostSwagger } from '~/common/swagger/post/index-post.swagger';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import { CreatePostSwagger } from '~/common/swagger/post/create-post.swagger';
import { ShowPostSwagger } from '~/common/swagger/post/show-post.swagger';
import { UpdatePostSwagger } from '~/common/swagger/post/update-post.swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new post' })
  @ApiResponse({
    status: 201,
    description: 'new post created successfully',
    type: CreatePostSwagger,
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
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_post']),
  )
  @ApiOperation({ summary: 'List all post of user' })
  @ApiResponse({
    status: 200,
    description: 'List of post successfully returned',
    type: IndexPostSwagger,
    isArray: true,
  })
  findAll() {
    return this.postService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'List one post of user' })
  @ApiResponse({
    status: 200,
    description: 'One post successfully returned',
    type: ShowPostSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_post']),
  )
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post of user' })
  @ApiResponse({
    status: 200,
    description: 'Post updated with successfully',
    type: UpdatePostSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Post invalid',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: NotFoundSwagger,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['update_post']),
  )
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_post']),
  )
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
