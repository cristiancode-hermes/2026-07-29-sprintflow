import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface TaskQueryFilters {
  status?: TaskStatus;
  assignee?: string;
  priority?: TaskPriority;
  search?: string;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findBySprint(
    sprintId: string,
    filters?: TaskQueryFilters,
  ): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = { sprintId };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.assignee) {
      where.assigneeId = filters.assignee;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }

    let query = this.tasksRepository.find({
      where,
      order: { position: 'ASC' },
      relations: { assignee: true },
    });

    if (filters?.search) {
      query = (query as Promise<Task[]>).then((tasks) =>
        tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            (t.description &&
              t.description
                .toLowerCase()
                .includes(filters.search!.toLowerCase())),
        ),
      );
    }

    return query;
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { assignee: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(sprintId: string, dto: CreateTaskDto): Promise<Task> {
    const taskData: Record<string, unknown> = { ...dto, sprintId };
    const task = this.tasksRepository.create(taskData as any);
    return this.tasksRepository.save(task) as unknown as Task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const dtoAny = dto as Record<string, unknown>;

    // If status is being changed to 'done', set completedAt
    if (dtoAny.status === 'done' && task.status !== 'done') {
      dtoAny.completedAt = new Date();
    } else if (dtoAny.status && dtoAny.status !== 'done') {
      dtoAny.completedAt = null;
    }

    Object.assign(task, dtoAny);
    return this.tasksRepository.save(task) as unknown as Task;
  }

  async remove(id: string): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.tasksRepository.remove(task);
  }
}
