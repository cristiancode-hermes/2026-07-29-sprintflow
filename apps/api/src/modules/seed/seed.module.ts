import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Sprint } from '../sprints/sprint.entity';
import { Task } from '../tasks/task.entity';
import { SprintGoal } from '../goals/sprint-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Sprint, Task, SprintGoal])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
