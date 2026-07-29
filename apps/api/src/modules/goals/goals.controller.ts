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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Get('api/sprints/:sid/goals')
  findBySprint(@Param('sid') sid: string) {
    return this.goalsService.findBySprint(sid);
  }

  @Post('api/sprints/:sid/goals')
  create(
    @Param('sid') sid: string,
    @Body() dto: CreateGoalDto,
  ) {
    return this.goalsService.create(sid, dto);
  }

  @Get('api/goals/:id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(id);
  }

  @Patch('api/goals/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, dto);
  }

  @Delete('api/goals/:id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(id);
  }
}
