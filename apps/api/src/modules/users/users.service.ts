import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data as any);
    return this.usersRepository.save(user) as unknown as User;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data);
    return this.usersRepository.save(user) as unknown as User;
  }

  async updateSettings(
    id: string,
    settings: { theme?: string; defaultSprintDays?: number },
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (settings.theme !== undefined) user.theme = settings.theme;
    if (settings.defaultSprintDays !== undefined)
      user.defaultSprintDays = settings.defaultSprintDays;
    return this.usersRepository.save(user) as unknown as User;
  }
}
