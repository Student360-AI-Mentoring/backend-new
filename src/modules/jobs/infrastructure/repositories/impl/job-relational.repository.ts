import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '@/database/entities';
import { JobMapper } from '../../mappers/job.mapper';
import { FindJobsParams, JobRepository } from '../job.repository';
import { Job } from '../../../domain/job';

@Injectable()
export class JobRelationalRepository implements JobRepository {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>,
  ) {}

  async findAll(params: FindJobsParams): Promise<{
    data: Job[];
    total: number;
  }> {
    const { page, limit, filters = {} } = params;

    const pageNumber = Math.max(page, 1);
    const limitNumber = Math.max(limit, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const qb = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.location', 'location');

    if (filters.search) {
      qb.andWhere('(job.title ILIKE :search OR job.description ILIKE :search OR job.requirements ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.companyId) {
      qb.andWhere('job.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters.categoryId) {
      qb.andWhere('job.categoryId = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters.locationId) {
      qb.andWhere('job.locationId = :locationId', { locationId: filters.locationId });
    }

    if (filters.employmentType) {
      qb.andWhere('job.employmentType = :employmentType', { employmentType: filters.employmentType });
    }

    if (filters.experienceLevel) {
      qb.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: filters.experienceLevel });
    }

    if (filters.isActive !== undefined) {
      qb.andWhere('job.isActive = :isActive', { isActive: filters.isActive });
    }

    qb.orderBy('job.createdAt', 'DESC').skip(skip).take(limitNumber);

    const [entities, total] = await qb.getManyAndCount();

    const data = JobMapper.toDomainArray(entities);

    return {
      data,
      total,
    };
  }
}
