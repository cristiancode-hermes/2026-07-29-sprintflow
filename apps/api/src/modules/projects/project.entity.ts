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
import { User } from '../users/user.entity';
import { Sprint } from '../sprints/sprint.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color!: string | null;

  @Column({ type: 'varchar', length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user: User) => user.projects)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => Sprint, (sprint: Sprint) => sprint.project)
  sprints?: Sprint[];
}
