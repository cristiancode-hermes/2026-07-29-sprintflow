import { IsString, IsOptional, IsDateString, IsInt, MaxLength } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsInt()
  velocity?: number;
}
