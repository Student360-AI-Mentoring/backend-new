import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@/type';
import { StudentIdsService } from './student-ids.service';
import { CreateStudentIdDto } from './dto/create-student-id.dto';
import { UpdateStudentIdDto } from './dto/update-student-id.dto';
import { StudentIdResponseDto } from './dto/student-id-response.dto';
import { GetStudentIdsQueryDto } from './dto/get-student-ids-query.dto';
import { StudentIdDoc } from './constants/student-id-doc.constants';

@ApiTags('Student IDs')
@Controller('student-ids')
export class StudentIdsController {
  constructor(private readonly studentIdsService: StudentIdsService) {}

  @Post()
  @StudentIdDoc.CreateSummary()
  @StudentIdDoc.CreateSuccess()
  @StudentIdDoc.CreateBadRequest()
  @StudentIdDoc.CreateConflict()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStudentIdDto: CreateStudentIdDto): Promise<StudentIdResponseDto> {
    return this.studentIdsService.create(createStudentIdDto);
  }

  @Get()
  @StudentIdDoc.GetAllSummary()
  @StudentIdDoc.GetAllSuccess()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-indexed)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records per page', example: 10 })
  findAll(@Query() query: GetStudentIdsQueryDto): Promise<{ data: StudentIdResponseDto[]; pagination: IPagination }> {
    return this.studentIdsService.findAll(query);
  }

  @Get('search')
  @StudentIdDoc.SearchSummary()
  @ApiQuery({ name: 'q', description: 'Search query' })
  @StudentIdDoc.SearchSuccess()
  search(@Query('q') query: string): Promise<StudentIdResponseDto[]> {
    return this.studentIdsService.search(query);
  }

  @Get(':id')
  @StudentIdDoc.GetOneSummary()
  @ApiParam({ name: 'id', description: 'Student ID' })
  @StudentIdDoc.GetOneSuccess()
  @StudentIdDoc.GetOneNotFound()
  findOne(@Param('id') id: string): Promise<StudentIdResponseDto> {
    return this.studentIdsService.findOne(id);
  }

  @Patch(':id')
  @StudentIdDoc.UpdateSummary()
  @ApiParam({ name: 'id', description: 'Student ID' })
  @StudentIdDoc.UpdateSuccess()
  @StudentIdDoc.GetOneNotFound()
  update(@Param('id') id: string, @Body() updateStudentIdDto: UpdateStudentIdDto): Promise<StudentIdResponseDto> {
    return this.studentIdsService.update(id, updateStudentIdDto);
  }

  @Delete(':id')
  @StudentIdDoc.DeleteSummary()
  @ApiParam({ name: 'id', description: 'Student ID' })
  @StudentIdDoc.DeleteSuccess()
  @StudentIdDoc.GetOneNotFound()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.studentIdsService.remove(id);
  }
}
