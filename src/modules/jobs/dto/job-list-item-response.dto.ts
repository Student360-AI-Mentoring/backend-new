import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class JobCompanySummaryDto {
  @ApiProperty({ description: 'Company identifier', example: '1001' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Company name', example: 'Tech Innovators' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Company website',
    example: 'https://tech-innovators.example.com',
    nullable: true,
  })
  @Expose()
  website: string | null;

  @ApiProperty({
    description: 'Contact email',
    example: 'hr@tech-innovators.example.com',
    nullable: true,
  })
  @Expose({ name: 'contact_email' })
  contactEmail: string | null;

  @ApiProperty({
    description: 'Logo URL',
    example: 'https://cdn.example.com/logos/tech-innovators.png',
    nullable: true,
  })
  @Expose({ name: 'logo_url' })
  logoUrl: string | null;
}

export class JobCategorySummaryDto {
  @ApiProperty({ description: 'Category identifier', example: 3 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Category name', example: 'Software Engineering' })
  @Expose()
  name: string;
}

export class JobLocationSummaryDto {
  @ApiProperty({ description: 'Location identifier', example: 5 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Location name', example: 'Ho Chi Minh City' })
  @Expose()
  name: string;
}

export class JobListItemResponseDto {
  @ApiProperty({ description: 'Job identifier', example: '2001' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Company identifier', example: '1001' })
  @Expose({ name: 'company_id' })
  companyId: string;

  @ApiProperty({ description: 'Job title', example: 'Backend Developer' })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Job description',
    example: 'We are looking for a Backend Developer to build scalable services.',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: 'Job requirements',
    example: '- 3+ years of experience with Node.js\n- Experience with PostgreSQL',
    nullable: true,
  })
  @Expose()
  requirements: string | null;

  @ApiProperty({
    name: 'location_text',
    description: 'Free-form location text specified by recruiter',
    example: 'District 1, Ho Chi Minh City',
    nullable: true,
  })
  @Expose({ name: 'location_text' })
  locationText: string | null;

  @ApiProperty({
    name: 'employment_type',
    description: 'Type of employment',
    example: 'full_time',
    nullable: true,
  })
  @Expose({ name: 'employment_type' })
  employmentType: string | null;

  @ApiProperty({
    name: 'experience_level',
    description: 'Experience level required',
    example: 'junior',
    nullable: true,
  })
  @Expose({ name: 'experience_level' })
  experienceLevel: string | null;

  @ApiProperty({
    name: 'salary_min',
    description: 'Minimum salary offered',
    example: '15000000',
    nullable: true,
  })
  @Expose({ name: 'salary_min' })
  salaryMin: string | null;

  @ApiProperty({
    name: 'salary_max',
    description: 'Maximum salary offered',
    example: '25000000',
    nullable: true,
  })
  @Expose({ name: 'salary_max' })
  salaryMax: string | null;

  @ApiProperty({
    name: 'salary_currency',
    description: 'Salary currency code (ISO 4217)',
    example: 'VND',
    nullable: true,
  })
  @Expose({ name: 'salary_currency' })
  salaryCurrency: string | null;

  @ApiProperty({
    name: 'application_method',
    description: 'Preferred application method',
    example: 'external',
    nullable: true,
  })
  @Expose({ name: 'application_method' })
  applicationMethod: string | null;

  @ApiProperty({
    name: 'application_url',
    description: 'External application URL',
    example: 'https://careers.example.com/jobs/backend-developer',
    nullable: true,
  })
  @Expose({ name: 'application_url' })
  applicationUrl: string | null;

  @ApiProperty({
    name: 'application_email',
    description: 'Contact email for applications',
    example: 'careers@example.com',
    nullable: true,
  })
  @Expose({ name: 'application_email' })
  applicationEmail: string | null;

  @ApiProperty({
    name: 'apply_count',
    description: 'Number of applications received',
    example: '42',
    nullable: true,
  })
  @Expose({ name: 'apply_count' })
  applyCount: string | null;

  @ApiProperty({
    description: 'Application deadline',
    example: '2024-12-31T23:59:59.000Z',
    nullable: true,
  })
  @Expose()
  deadline: Date | null;

  @ApiProperty({
    name: 'is_active',
    description: 'Whether the job posting is currently active',
    example: true,
  })
  @Expose({ name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    name: 'created_at',
    description: 'Creation timestamp',
    example: '2024-09-20T08:30:00.000Z',
  })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    description: 'Last update timestamp',
    example: '2024-09-22T10:15:00.000Z',
  })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Company details',
    type: JobCompanySummaryDto,
    nullable: true,
  })
  @Expose()
  @Type(() => JobCompanySummaryDto)
  company: JobCompanySummaryDto | null;

  @ApiProperty({
    description: 'Job category details',
    type: JobCategorySummaryDto,
    nullable: true,
  })
  @Expose()
  @Type(() => JobCategorySummaryDto)
  category: JobCategorySummaryDto | null;

  @ApiProperty({
    description: 'Location details',
    type: JobLocationSummaryDto,
    nullable: true,
  })
  @Expose()
  @Type(() => JobLocationSummaryDto)
  location: JobLocationSummaryDto | null;
}
