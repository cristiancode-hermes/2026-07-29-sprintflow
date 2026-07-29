import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sprint } from '../sprints/sprint.entity';
import { User } from '../users/user.entity';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'todo',
  })
  status!: TaskStatus;

  @Column({ type: 'int', default: 1 })
  points!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'medium',
  })
  priority!: TaskPriority;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ type: 'varchar', length: 36 })
  sprintId!: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  assigneeId!: string | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @ManyToOne(() => Sprint, (sprint: Sprint) => sprint.tasks)
  @JoinColumn({ name: 'sprintId' })
  sprint!: Sprint;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
