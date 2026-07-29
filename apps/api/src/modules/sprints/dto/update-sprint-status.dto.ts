import { IsString, IsIn } from 'class-validator';

export class UpdateSprintStatusDto {
  @IsString()
  @IsIn(['planning', 'active', 'completed', 'cancelled'])
  status!: string;
}
