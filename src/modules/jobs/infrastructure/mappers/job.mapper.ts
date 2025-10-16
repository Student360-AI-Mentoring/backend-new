import { JobEntity } from '@/database/entities';
import { Job } from '../../domain/job';
import { Company } from '../../domain/company';
import { JobCategory } from '../../domain/job-category';
import { JobLocation } from '../../domain/job-location';

export class JobMapper {
  static toDomain(entity: JobEntity): Job {
    const company = entity.company
      ? new Company(
          entity.company.id,
          entity.company.name,
          entity.company.description,
          entity.company.website,
          entity.company.industryId,
          entity.company.size,
          entity.company.contactEmail,
          entity.company.logoUrl,
          entity.company.address,
          entity.company.createdAt,
          entity.company.updatedAt,
        )
      : null;

    const category = entity.category
      ? new JobCategory(
          entity.category.id,
          entity.category.name,
          entity.category.description,
          entity.category.createdAt,
          entity.category.updatedAt,
        )
      : null;

    const location = entity.location ? new JobLocation(entity.location.id, entity.location.name) : null;

    return new Job(entity.id, entity.companyId, entity.title, {
      company,
      categoryId: entity.categoryId,
      category,
      locationId: entity.locationId,
      location,
      description: entity.description,
      requirements: entity.requirements,
      locationText: entity.locationText,
      employmentType: entity.employmentType,
      experienceLevel: entity.experienceLevel,
      salaryMin: entity.salaryMin,
      salaryMax: entity.salaryMax,
      salaryCurrency: entity.salaryCurrency,
      applicationMethod: entity.applicationMethod,
      applicationUrl: entity.applicationUrl,
      applicationEmail: entity.applicationEmail,
      applyCount: entity.applyCount,
      deadline: entity.deadline,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toDomainArray(entities: JobEntity[]): Job[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
