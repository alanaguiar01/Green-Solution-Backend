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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '~/common/swagger/helpers/bad-request.swagger';
import RoleGuard from '~/guards/role.guard';
import PermissionGuard from '~/guards/permission.guard';
import { NotFoundSwagger } from '~/common/swagger/helpers/not-found.swagger';
import { CreateFeedbackSwagger } from '~/common/swagger/feedback/create-feedback.swagger';
import { IndexFeedbackSwagger } from '~/common/swagger/feedback/index.feedback.swagger';
import { ShowFeedbackSwagger } from '~/common/swagger/feedback/show-feedback.swagger';
import { UpdateFeedbackSwagger } from '~/common/swagger/feedback/update-feedback.swagger';

@Controller('feedbacks')
@ApiTags('Feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Add new feedback in api' })
  @ApiResponse({
    status: 201,
    description: 'New feedback added successfully',
    type: CreateFeedbackSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Params invalid',
    type: BadRequestSwagger,
  })
  // @UseGuards(
  //   RoleGuard(['creator', 'manager', 'employer', 'user']),
  //   PermissionGuard(['create_feedback']),
  // )
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all feedback of api' })
  @ApiResponse({
    status: 200,
    description: 'List feedback successfully returned',
    type: IndexFeedbackSwagger,
    isArray: true,
  })
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_feedback']),
  )
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['list_feedback']),
  )
  @ApiOperation({ summary: 'List one feedback of api' })
  @ApiResponse({
    status: 200,
    description: 'List one feedback successfully returned',
    type: ShowFeedbackSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Photo not found',
    type: NotFoundSwagger,
  })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one feedback of api' })
  @ApiResponse({
    status: 200,
    description: 'Feedback update with successfully',
    type: UpdateFeedbackSwagger,
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
    PermissionGuard(['update_feedback']),
  )
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @UseGuards(
    RoleGuard(['creator', 'manager', 'employer', 'user']),
    PermissionGuard(['delete_feedback']),
  )
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
