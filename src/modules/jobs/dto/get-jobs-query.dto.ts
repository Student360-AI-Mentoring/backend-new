import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EmploymentTypeEnum, ExperienceLevelEnum } from '../constants/job.constants';

export class GetJobsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @ApiPropertyOptional({
    description: 'Search text applied to job title, description, and requirements',
    example: 'Backend Developer',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by company identifier',
    example: '1001',
  })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by job category identifier',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Filter by location identifier',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  locationId?: number;

  @ApiPropertyOptional({
    description: 'Filter by employment type',
    example: EmploymentTypeEnum.FULL_TIME,
    enum: EmploymentTypeEnum,
  })
  @IsOptional()
  @IsEnum(EmploymentTypeEnum)
  employmentType?: EmploymentTypeEnum;

  @ApiPropertyOptional({
    description: 'Filter by experience level',
    example: ExperienceLevelEnum.JUNIOR,
    enum: ExperienceLevelEnum,
  })
  @IsOptional()
  @IsEnum(ExperienceLevelEnum)
  experienceLevel?: ExperienceLevelEnum;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;
}
