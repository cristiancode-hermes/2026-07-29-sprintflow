import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Sprint } from '../sprints/sprint.entity';
import { Task } from '../tasks/task.entity';
import { SprintGoal } from '../goals/sprint-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Task, SprintGoal])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
