import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';
import { Sprint } from './sprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint])],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
