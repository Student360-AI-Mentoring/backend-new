import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity, CompanyEntity, JobCategoryEntity, LocationEntity } from '../../database/entities';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobRepository } from './infrastructure/repositories/job.repository';
import { JobRelationalRepository } from './infrastructure/repositories/impl/job-relational.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity, CompanyEntity, JobCategoryEntity, LocationEntity])],
  controllers: [JobsController],
  providers: [
    JobsService,
    {
      provide: JobRepository,
      useClass: JobRelationalRepository,
    },
  ],
  exports: [JobsService],
})
export class JobsModule {}
