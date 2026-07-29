import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sprint } from '../sprints/sprint.entity';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36 })
  sprintId!: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  taskId!: string | null;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 50 })
  action!: string;

  @Column({ type: 'simple-json', nullable: true })
  details!: Record<string, unknown> | null;

  @ManyToOne(() => Sprint, (sprint: Sprint) => sprint.activityLogs)
  @JoinColumn({ name: 'sprintId' })
  sprint!: Sprint;

  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'taskId' })
  task?: Task | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
