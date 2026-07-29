import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, userId },
      relations: { sprints: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...dto,
      userId,
    } as any);
    return this.projectsRepository.save(project) as unknown as Project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    Object.assign(project, dto);
    return this.projectsRepository.save(project) as unknown as Project;
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectsRepository.remove(project);
  }
}
