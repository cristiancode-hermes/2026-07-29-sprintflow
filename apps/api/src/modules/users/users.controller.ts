import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() user: { id: string },
    @Body() data: { name?: string; email?: string },
  ) {
    return this.usersService.update(user.id, data);
  }

  @Get('me/settings')
  getSettings(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }

  @Patch('me/settings')
  updateSettings(
    @CurrentUser() user: { id: string },
    @Body() settings: { theme?: string; defaultSprintDays?: number },
  ) {
    return this.usersService.updateSettings(user.id, settings);
  }
}
