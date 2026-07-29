import { IsString, IsOptional, IsIn, IsInt, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['backlog', 'todo', 'in_progress', 'review', 'done'])
  status?: string;

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
