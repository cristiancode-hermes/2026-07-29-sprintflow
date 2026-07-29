import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Sprint } from '../sprints/sprint.entity';
import { Task } from '../tasks/task.entity';
import { SprintGoal } from '../goals/sprint-goal.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(SprintGoal)
    private goalsRepository: Repository<SprintGoal>,
  ) {}

  async seed() {
    const existingUser = await this.usersRepository.findOne({
      where: { email: 'demo@sprintflow.dev' },
    });
    if (existingUser) {
      this.logger.log('Database already seeded');
      return;
    }

    this.logger.log('Seeding database...');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const user = this.usersRepository.create({
      name: 'Demo User',
      email: 'demo@sprintflow.dev',
      password: hashedPassword,
      theme: 'system',
      defaultSprintDays: 14,
    } as any);
    const savedUser = await this.usersRepository.save(user) as unknown as User;

    // Create sample project
    const project = this.projectsRepository.create({
      name: 'SprintFlow MVP',
      description: 'Main project for building the SprintFlow agile management dashboard',
      color: '#6366f1',
      userId: savedUser.id,
    } as any);
    const savedProject = await this.projectsRepository.save(project) as unknown as Project;

    // Create sprints
    const now = new Date();
    const sprint1Start = new Date(now);
    sprint1Start.setDate(sprint1Start.getDate() - 14);
    const sprint1End = new Date(now);

    const sprint1 = this.sprintsRepository.create({
      name: 'Sprint 1: Foundation',
      goal: 'Set up the project foundation, database schema, and core API endpoints',
      startDate: sprint1Start,
      endDate: sprint1End,
      status: 'completed' as const,
      velocity: 18,
      projectId: savedProject.id,
    } as any);
    const savedSprint1 = await this.sprintsRepository.save(sprint1) as unknown as Sprint;

    const sprint2Start = new Date(now);
    const sprint2End = new Date(now);
    sprint2End.setDate(sprint2End.getDate() + 14);

    const sprint2 = this.sprintsRepository.create({
      name: 'Sprint 2: Features',
      goal: 'Implement sprint management features and dashboard analytics',
      startDate: sprint2Start,
      endDate: sprint2End,
      status: 'active' as const,
      projectId: savedProject.id,
    } as any);
    const savedSprint2 = await this.sprintsRepository.save(sprint2) as unknown as Sprint;

    // Create tasks for sprint 1 (completed)
    const sprint1Tasks = [
      { title: 'Set up NestJS project structure', status: 'done' as const, points: 3, priority: 'high' as const, position: 0 },
      { title: 'Configure TypeORM with SQLite', status: 'done' as const, points: 2, priority: 'high' as const, position: 1 },
      { title: 'Implement user authentication', status: 'done' as const, points: 5, priority: 'high' as const, position: 2 },
      { title: 'Create project CRUD endpoints', status: 'done' as const, points: 3, priority: 'medium' as const, position: 3 },
      { title: 'Design database schema', status: 'done' as const, points: 2, priority: 'high' as const, position: 4 },
      { title: 'Set up CI/CD pipeline', status: 'done' as const, points: 3, priority: 'medium' as const, position: 5 },
    ];

    for (const taskData of sprint1Tasks) {
      const task = this.tasksRepository.create({
        ...taskData,
        sprintId: savedSprint1.id,
        assigneeId: savedUser.id,
        completedAt: new Date(),
      } as any);
      await this.tasksRepository.save(task) as unknown as Task;
    }

    // Create tasks for sprint 2 (active)
    const sprint2Tasks = [
      { title: 'Implement sprint CRUD', status: 'done' as const, points: 3, priority: 'high' as const, position: 0 },
      { title: 'Build dashboard analytics', status: 'in_progress' as const, points: 8, priority: 'high' as const, position: 1 },
      { title: 'Create task board view', status: 'in_progress' as const, points: 5, priority: 'high' as const, position: 2 },
      { title: 'Implement goal tracking', status: 'todo' as const, points: 3, priority: 'medium' as const, position: 3 },
      { title: 'Add activity logging', status: 'todo' as const, points: 2, priority: 'medium' as const, position: 4 },
      { title: 'Write API documentation', status: 'backlog' as const, points: 2, priority: 'low' as const, position: 5 },
      { title: 'Performance optimization', status: 'backlog' as const, points: 5, priority: 'low' as const, position: 6 },
    ];

    for (const taskData of sprint2Tasks) {
      const task = this.tasksRepository.create({
        ...taskData,
        sprintId: savedSprint2.id,
        assigneeId: savedUser.id,
        completedAt: taskData.status === 'done' ? new Date() : null,
      } as any);
      await this.tasksRepository.save(task) as unknown as Task;
    }

    // Create goals for sprint 2
    const goals = [
      { title: 'Complete task board implementation', points: 5, completed: false, position: 0 },
      { title: 'Dashboard with real data', points: 8, completed: false, position: 1 },
      { title: 'All APIs documented', points: 2, completed: false, position: 2 },
    ];

    for (const goalData of goals) {
      const goal = this.goalsRepository.create({
        ...goalData,
        sprintId: savedSprint2.id,
      } as any);
      await this.goalsRepository.save(goal) as unknown as SprintGoal;
    }

    this.logger.log('Database seeded successfully');
  }
}
