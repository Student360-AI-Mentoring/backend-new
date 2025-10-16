import { Company } from './company';
import { JobCategory } from './job-category';
import { JobLocation } from './job-location';

export class Job {
  id: string;
  companyId: string;
  company: Company | null;
  categoryId: number | null;
  category: JobCategory | null;
  locationId: number | null;
  location: JobLocation | null;
  title: string;
  description: string | null;
  requirements: string | null;
  locationText: string | null;
  employmentType: string | null;
  experienceLevel: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryCurrency: string | null;
  applicationMethod: string | null;
  applicationUrl: string | null;
  applicationEmail: string | null;
  applyCount: string | null;
  deadline: Date | null;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    companyId: string,
    title: string,
    {
      company = null,
      categoryId = null,
      category = null,
      locationId = null,
      location = null,
      description = null,
      requirements = null,
      locationText = null,
      employmentType = null,
      experienceLevel = null,
      salaryMin = null,
      salaryMax = null,
      salaryCurrency = null,
      applicationMethod = null,
      applicationUrl = null,
      applicationEmail = null,
      applyCount = null,
      deadline = null,
      isActive = true,
      createdBy = null,
      updatedBy = null,
      createdAt,
      updatedAt,
    }: {
      company?: Company | null;
      categoryId?: number | null;
      category?: JobCategory | null;
      locationId?: number | null;
      location?: JobLocation | null;
      description?: string | null;
      requirements?: string | null;
      locationText?: string | null;
      employmentType?: string | null;
      experienceLevel?: string | null;
      salaryMin?: string | null;
      salaryMax?: string | null;
      salaryCurrency?: string | null;
      applicationMethod?: string | null;
      applicationUrl?: string | null;
      applicationEmail?: string | null;
      applyCount?: string | null;
      deadline?: Date | null;
      isActive?: boolean;
      createdBy?: string | null;
      updatedBy?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ) {
    this.id = id;
    this.companyId = companyId;
    this.company = company;
    this.categoryId = categoryId;
    this.category = category;
    this.locationId = locationId;
    this.location = location;
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.locationText = locationText;
    this.employmentType = employmentType;
    this.experienceLevel = experienceLevel;
    this.salaryMin = salaryMin;
    this.salaryMax = salaryMax;
    this.salaryCurrency = salaryCurrency;
    this.applicationMethod = applicationMethod;
    this.applicationUrl = applicationUrl;
    this.applicationEmail = applicationEmail;
    this.applyCount = applyCount;
    this.deadline = deadline;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }
}
