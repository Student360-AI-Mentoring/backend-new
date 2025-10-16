import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@/type';
import { JobsService } from './jobs.service';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { JobListItemResponseDto } from './dto/job-list-item-response.dto';
import { JobDoc } from './constants/job-doc.constants';

@ApiTags('Jobs')
@ApiExtraModels(JobListItemResponseDto)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @JobDoc.GetAllSummary()
  @JobDoc.GetAllSuccess()
  @JobDoc.GetAllBadRequest()
  findAll(@Query() query: GetJobsQueryDto): Promise<{ data: JobListItemResponseDto[]; pagination: IPagination }> {
    return this.jobsService.findAll(query);
  }
}
