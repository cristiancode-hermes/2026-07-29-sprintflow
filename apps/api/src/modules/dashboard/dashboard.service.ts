import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sprint } from '../sprints/sprint.entity';
import { Task } from '../tasks/task.entity';
import { SprintGoal } from '../goals/sprint-goal.entity';

export interface DashboardData {
  sprint: Sprint;
  kpis: KpiData;
  burndown: BurndownData;
  velocity: VelocityData;
  distribution: DistributionData;
}

export interface KpiData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalPoints: number;
  completedPoints: number;
  pendingPoints: number;
  completionPercentage: number;
  daysRemaining: number;
  totalDays: number;
}

export interface BurndownData {
  dates: string[];
  ideal: number[];
  actual: number[];
}

export interface VelocityData {
  currentVelocity: number;
  averageVelocity: number;
  sprintCount: number;
}

export interface DistributionData {
  byStatus: { name: string; count: number }[];
  byPriority: { name: string; count: number }[];
  byAssignee: { name: string; count: number }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(SprintGoal)
    private goalsRepository: Repository<SprintGoal>,
  ) {}

  async getDashboard(sprintId: string): Promise<DashboardData> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id: sprintId },
      relations: { tasks: true, goals: true, project: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    const tasks = sprint.tasks || [];
    const goals = sprint.goals || [];

    const kpis = this.computeKpis(tasks as Task[], goals as SprintGoal[], sprint);
    const burndown = this.computeBurndown(tasks as Task[], sprint);
    const velocity = await this.computeVelocity(sprint.projectId, tasks as Task[]);
    const distribution = this.computeDistribution(tasks as Task[]);

    return { sprint, kpis, burndown, velocity, distribution };
  }

  async getKpis(sprintId: string): Promise<KpiData> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id: sprintId },
      relations: { tasks: true, goals: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return this.computeKpis(sprint.tasks || ([] as unknown as Task[]), sprint.goals || ([] as unknown as SprintGoal[]), sprint);
  }

  async getBurndown(sprintId: string): Promise<BurndownData> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id: sprintId },
      relations: { tasks: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return this.computeBurndown(sprint.tasks || ([] as unknown as Task[]), sprint);
  }

  async getVelocity(sprintId: string): Promise<VelocityData> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id: sprintId },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return this.computeVelocity(sprint.projectId, []);
  }

  async getDistribution(sprintId: string): Promise<DistributionData> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id: sprintId },
      relations: { tasks: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return this.computeDistribution(sprint.tasks || ([] as unknown as Task[]));
  }

  private computeKpis(tasks: Task[], goals: SprintGoal[], sprint: Sprint): KpiData {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;
    const totalPoints = tasks.reduce((s, t) => s + (t.points || 0), 0);
    const completedPoints = tasks
      .filter((t) => t.status === 'done')
      .reduce((s, t) => s + (t.points || 0), 0);
    const pendingPoints = totalPoints - completedPoints;
    const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    const now = new Date();
    const endDate = new Date(sprint.endDate);
    const startDate = new Date(sprint.startDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalPoints,
      completedPoints,
      pendingPoints,
      completionPercentage,
      daysRemaining,
      totalDays,
    };
  }

  private computeBurndown(tasks: Task[], sprint: Sprint): BurndownData {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPoints = tasks.reduce((s, t) => s + (t.points || 0), 0);

    const dates: string[] = [];
    const ideal: number[] = [];
    const actual: number[] = [];

    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);

      // Ideal line: linear from totalPoints to 0
      ideal.push(Math.round((totalPoints * (totalDays - i)) / totalDays));

      // Actual: points remaining for tasks not completed by this date
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      const remainingPoints = tasks
        .filter((t) => !t.completedAt || new Date(t.completedAt) > dayEnd)
        .reduce((s, t) => s + (t.points || 0), 0);
      actual.push(remainingPoints);
    }

    return { dates, ideal, actual };
  }

  private async computeVelocity(projectId: string, currentTasks: Task[]): Promise<VelocityData> {
    const completedSprints = await this.sprintsRepository.find({
      where: { projectId, status: 'completed' },
    });

    const currentVelocity = currentTasks
      .filter((t: Task) => t.status === 'done')
      .reduce((s: number, t: Task) => s + (t.points || 0), 0);

    const velocities = completedSprints
      .filter((s: Sprint) => s.velocity !== null)
      .map((s: Sprint) => s.velocity as number);

    const averageVelocity =
      velocities.length > 0
        ? Math.round(velocities.reduce((a: number, b: number) => a + b, 0) / velocities.length)
        : 0;

    return {
      currentVelocity,
      averageVelocity,
      sprintCount: completedSprints.length,
    };
  }

  private computeDistribution(tasks: Task[]): DistributionData {
    const statusCounts: Record<string, number> = {};
    const priorityCounts: Record<string, number> = {};
    const assigneeCounts: Record<string, number> = {};

    tasks.forEach((t: Task) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
      if (t.assigneeId) {
        assigneeCounts[t.assigneeId] = (assigneeCounts[t.assigneeId] || 0) + 1;
      }
    });

    return {
      byStatus: Object.entries(statusCounts).map(([name, count]) => ({ name, count })),
      byPriority: Object.entries(priorityCounts).map(([name, count]) => ({ name, count })),
      byAssignee: Object.entries(assigneeCounts).map(([name, count]) => ({ name, count })),
    };
  }
}
