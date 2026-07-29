import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;
}
