import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/sprints/:id/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Param('id') id: string) {
    return this.dashboardService.getDashboard(id);
  }

  @Get('kpis')
  getKpis(@Param('id') id: string) {
    return this.dashboardService.getKpis(id);
  }

  @Get('burndown')
  getBurndown(@Param('id') id: string) {
    return this.dashboardService.getBurndown(id);
  }

  @Get('velocity')
  getVelocity(@Param('id') id: string) {
    return this.dashboardService.getVelocity(id);
  }

  @Get('distribution')
  getDistribution(@Param('id') id: string) {
    return this.dashboardService.getDistribution(id);
  }
}
