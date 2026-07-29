import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprintGoal } from './sprint-goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(SprintGoal)
    private goalsRepository: Repository<SprintGoal>,
  ) {}

  async findBySprint(sprintId: string): Promise<SprintGoal[]> {
    return this.goalsRepository.find({
      where: { sprintId },
      order: { position: 'ASC' },
    });
  }

  async findOne(id: string): Promise<SprintGoal> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    return goal;
  }

  async create(sprintId: string, dto: CreateGoalDto): Promise<SprintGoal> {
    const goal = this.goalsRepository.create({
      ...dto,
      sprintId,
    } as any);
    return this.goalsRepository.save(goal) as unknown as SprintGoal;
  }

  async update(id: string, dto: UpdateGoalDto): Promise<SprintGoal> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    Object.assign(goal, dto);
    return this.goalsRepository.save(goal) as unknown as SprintGoal;
  }

  async remove(id: string): Promise<void> {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
    await this.goalsRepository.remove(goal);
  }
}
