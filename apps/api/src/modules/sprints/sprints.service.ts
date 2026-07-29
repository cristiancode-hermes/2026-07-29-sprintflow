import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './sprint.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { UpdateSprintStatusDto } from './dto/update-sprint-status.dto';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
  ) {}

  async findByProject(projectId: string): Promise<Sprint[]> {
    return this.sprintsRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      relations: { tasks: true, goals: true },
    });
  }

  async findOne(id: string): Promise<Sprint> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id },
      relations: { tasks: true, goals: true, project: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return sprint;
  }

  async create(projectId: string, dto: CreateSprintDto): Promise<Sprint> {
    const sprint = this.sprintsRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      projectId,
    } as any);
    return this.sprintsRepository.save(sprint) as unknown as Sprint;
  }

  async update(id: string, dto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.sprintsRepository.findOne({ where: { id } });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    const dtoAny = dto as Record<string, unknown>;
    if (dtoAny.startDate) dtoAny.startDate = new Date(dtoAny.startDate as string);
    if (dtoAny.endDate) dtoAny.endDate = new Date(dtoAny.endDate as string);
    Object.assign(sprint, dtoAny);
    return this.sprintsRepository.save(sprint) as unknown as Sprint;
  }

  async updateStatus(
    id: string,
    dto: UpdateSprintStatusDto,
  ): Promise<Sprint> {
    const sprint = await this.sprintsRepository.findOne({ where: { id } });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    sprint.status = dto.status as Sprint['status'];
    return this.sprintsRepository.save(sprint) as unknown as Sprint;
  }

  async completeSprint(id: string): Promise<Sprint> {
    const sprint = await this.sprintsRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    if (sprint.status === 'completed') {
      throw new BadRequestException('Sprint is already completed');
    }

    const completedPoints = sprint.tasks
      ? sprint.tasks
          .filter((t: { status: string; points: number }) => t.status === 'done')
          .reduce((sum: number, t: { points: number }) => sum + t.points, 0)
      : 0;

    sprint.status = 'completed';
    sprint.velocity = completedPoints;
    return this.sprintsRepository.save(sprint) as unknown as Sprint;
  }

  async remove(id: string): Promise<void> {
    const sprint = await this.sprintsRepository.findOne({ where: { id } });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    await this.sprintsRepository.remove(sprint);
  }
}
