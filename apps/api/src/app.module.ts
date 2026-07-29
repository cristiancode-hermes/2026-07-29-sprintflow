import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { GoalsModule } from './modules/goals/goals.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ActivityModule } from './modules/activity/activity.module';
import { SeedModule } from './modules/seed/seed.module';
import { SeedService } from './modules/seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './data/sprintflow.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    SprintsModule,
    GoalsModule,
    TasksModule,
    DashboardModule,
    ActivityModule,
    SeedModule,
  ],
})
export class AppModule {
  constructor(private seedService: SeedService) {}

  async onApplicationBootstrap() {
    await this.seedService.seed();
  }
}
