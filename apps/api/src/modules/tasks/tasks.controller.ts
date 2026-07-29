import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService, TaskQueryFilters } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('api/sprints/:sid/tasks')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'assignee', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'search', required: false })
  findBySprint(
    @Param('sid') sid: string,
    @Query('status') status?: string,
    @Query('assignee') assignee?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    const filters: TaskQueryFilters = {};
    if (status) filters.status = status as TaskQueryFilters['status'];
    if (assignee) filters.assignee = assignee;
    if (priority) filters.priority = priority as TaskQueryFilters['priority'];
    if (search) filters.search = search;
    return this.tasksService.findBySprint(sid, filters);
  }

  @Post('api/sprints/:sid/tasks')
  create(
    @Param('sid') sid: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(sid, dto);
  }

  @Get('api/tasks/:id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch('api/tasks/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }

  @Delete('api/tasks/:id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
