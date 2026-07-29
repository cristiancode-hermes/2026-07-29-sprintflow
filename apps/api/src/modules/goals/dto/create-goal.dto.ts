import { IsString, IsOptional, IsInt, IsBoolean, MaxLength } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  position?: number;
}
