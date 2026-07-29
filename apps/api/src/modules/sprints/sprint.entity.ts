import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { SprintGoal } from '../goals/sprint-goal.entity';
import { Task } from '../tasks/task.entity';
import { ActivityLog } from '../activity/activity-log.entity';

export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  goal!: string | null;

  @Column({ type: 'datetime' })
  startDate!: Date;

  @Column({ type: 'datetime' })
  endDate!: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'planning',
  })
  status!: SprintStatus;

  @Column({ type: 'int', nullable: true })
  velocity!: number | null;

  @Column({ type: 'varchar', length: 36 })
  projectId!: string;

  @ManyToOne(() => Project, (project: Project) => project.sprints)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => SprintGoal, (goal: SprintGoal) => goal.sprint)
  goals?: SprintGoal[];

  @OneToMany(() => Task, (task: Task) => task.sprint)
  tasks?: Task[];

  @OneToMany(() => ActivityLog, (log: ActivityLog) => log.sprint)
  activityLogs?: ActivityLog[];
}
