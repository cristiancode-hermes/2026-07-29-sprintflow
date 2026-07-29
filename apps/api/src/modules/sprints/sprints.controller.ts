import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { UpdateSprintStatusDto } from './dto/update-sprint-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sprints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Get('api/projects/:pid/sprints')
  findByProject(@Param('pid') pid: string) {
    return this.sprintsService.findByProject(pid);
  }

  @Post('api/projects/:pid/sprints')
  create(
    @Param('pid') pid: string,
    @Body() dto: CreateSprintDto,
  ) {
    return this.sprintsService.create(pid, dto);
  }

  @Get('api/sprints/:id')
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @Patch('api/sprints/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSprintDto,
  ) {
    return this.sprintsService.update(id, dto);
  }

  @Patch('api/sprints/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSprintStatusDto,
  ) {
    return this.sprintsService.updateStatus(id, dto);
  }

  @Post('api/sprints/:id/complete')
  completeSprint(@Param('id') id: string) {
    return this.sprintsService.completeSprint(id);
  }

  @Delete('api/sprints/:id')
  remove(@Param('id') id: string) {
    return this.sprintsService.remove(id);
  }
}
