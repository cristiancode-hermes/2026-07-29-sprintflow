import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityRepository: Repository<ActivityLog>,
  ) {}

  async findBySprint(
    sprintId: string,
    options: { limit?: number; offset?: number; type?: string } = {},
  ): Promise<ActivityLog[]> {
    const where: Record<string, unknown> = { sprintId };
    if (options.type) {
      where.action = options.type;
    }

    return this.activityRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: options.limit || 50,
      skip: options.offset || 0,
      relations: { user: true, task: true },
    });
  }

  async log(data: {
    sprintId: string;
    taskId?: string;
    userId: string;
    action: string;
    details?: Record<string, unknown>;
  }): Promise<ActivityLog> {
    const log = this.activityRepository.create(data as any);
    return this.activityRepository.save(log) as unknown as ActivityLog;
  }
}
