import { Job } from '../../domain/job';

export interface JobFilterOptions {
  search?: string;
  companyId?: string;
  categoryId?: number;
  locationId?: number;
  employmentType?: string;
  experienceLevel?: string;
  isActive?: boolean;
}

export interface FindJobsParams {
  page: number;
  limit: number;
  filters?: JobFilterOptions;
}

export abstract class JobRepository {
  abstract findAll(params: FindJobsParams): Promise<{
    data: Job[];
    total: number;
  }>;
}
