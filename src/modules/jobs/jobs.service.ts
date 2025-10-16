import { Injectable } from '@nestjs/common';
import { IPagination } from '@/type';
import { JobRepository } from './infrastructure/repositories/job.repository';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import {
  JobCategorySummaryDto,
  JobCompanySummaryDto,
  JobListItemResponseDto,
  JobLocationSummaryDto,
} from './dto/job-list-item-response.dto';
import { Job } from './domain/job';
import { Company } from './domain/company';
import { JobCategory } from './domain/job-category';
import { JobLocation } from './domain/job-location';

@Injectable()
export class JobsService {
  constructor(private readonly jobRepository: JobRepository) {}

  async findAll(query: GetJobsQueryDto): Promise<{ data: JobListItemResponseDto[]; pagination: IPagination }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const { data: jobs, total } = await this.jobRepository.findAll({
      page,
      limit,
      filters: {
        search: query.search,
        companyId: query.companyId,
        categoryId: query.categoryId,
        locationId: query.locationId,
        employmentType: query.employmentType,
        experienceLevel: query.experienceLevel,
        isActive: query.isActive ?? true,
      },
    });

    return {
      data: jobs.map((job) => this.toResponseDto(job)),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  private toResponseDto(job: Job): JobListItemResponseDto {
    const dto = new JobListItemResponseDto();

    dto.id = job.id;
    dto.companyId = job.companyId;
    dto.title = job.title;
    dto.description = job.description;
    dto.requirements = job.requirements;
    dto.locationText = job.locationText;
    dto.employmentType = job.employmentType;
    dto.experienceLevel = job.experienceLevel;
    dto.salaryMin = job.salaryMin;
    dto.salaryMax = job.salaryMax;
    dto.salaryCurrency = job.salaryCurrency;
    dto.applicationMethod = job.applicationMethod;
    dto.applicationUrl = job.applicationUrl;
    dto.applicationEmail = job.applicationEmail;
    dto.applyCount = job.applyCount;
    dto.deadline = job.deadline;
    dto.isActive = job.isActive;
    dto.createdAt = job.createdAt;
    dto.updatedAt = job.updatedAt;
    dto.company = job.company ? this.mapCompany(job.company) : null;
    dto.category = job.category ? this.mapCategory(job.category) : null;
    dto.location = job.location ? this.mapLocation(job.location) : null;

    return dto;
  }

  private mapCompany(company: Company): JobCompanySummaryDto {
    const dto = new JobCompanySummaryDto();
    dto.id = company.id;
    dto.name = company.name;
    dto.website = company.website;
    dto.contactEmail = company.contactEmail;
    dto.logoUrl = company.logoUrl;
    return dto;
  }

  private mapCategory(category: JobCategory): JobCategorySummaryDto {
    const dto = new JobCategorySummaryDto();
    dto.id = category.id;
    dto.name = category.name;
    return dto;
  }

  private mapLocation(location: JobLocation): JobLocationSummaryDto {
    const dto = new JobLocationSummaryDto();
    dto.id = location.id;
    dto.name = location.name;
    return dto;
  }
}
