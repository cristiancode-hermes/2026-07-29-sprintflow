import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sprint } from '../sprints/sprint.entity';

@Entity('sprint_goals')
export class SprintGoal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ type: 'varchar', length: 36 })
  sprintId!: string;

  @ManyToOne(() => Sprint, (sprint: Sprint) => sprint.goals)
  @JoinColumn({ name: 'sprintId' })
  sprint!: Sprint;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
