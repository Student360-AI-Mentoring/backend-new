import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@/type';
import { StudentIdDoc } from './constants/student-id-doc.constants';
import { CreateStudentIdDto } from './dto/create-student-id.dto';
import { GetStudentIdsQueryDto } from './dto/get-student-ids-query.dto';
import { StudentIdResponseDto } from './dto/student-id-response.dto';
import { UpdateStudentIdDto } from './dto/update-student-id.dto';
import { StudentIdsService } from './student-ids.service';

@ApiTags('Student IDs')
@ApiExtraModels(StudentIdResponseDto)
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
  @StudentIdDoc.SearchSuccess()
  @ApiQuery({ name: 'q', description: 'Search query text', example: 'computer' })
  search(@Query('q') query: string): Promise<StudentIdResponseDto[]> {
    return this.studentIdsService.search(query);
  }

  @Get(':id')
  @StudentIdDoc.GetOneSummary()
  @StudentIdDoc.GetOneSuccess()
  @StudentIdDoc.GetOneNotFound()
  @ApiParam({ name: 'id', description: 'Student ID identifier', example: 'SV2024001' })
  findOne(@Param('id') id: string): Promise<StudentIdResponseDto> {
    return this.studentIdsService.findOne(id);
  }

  @Patch(':id')
  @StudentIdDoc.UpdateSummary()
  @StudentIdDoc.UpdateSuccess()
  @StudentIdDoc.GetOneNotFound()
  @ApiParam({ name: 'id', description: 'Student ID identifier', example: 'SV2024001' })
  update(@Param('id') id: string, @Body() updateStudentIdDto: UpdateStudentIdDto): Promise<StudentIdResponseDto> {
    return this.studentIdsService.update(id, updateStudentIdDto);
  }

  @Delete(':id')
  @StudentIdDoc.DeleteSummary()
  @StudentIdDoc.DeleteSuccess()
  @StudentIdDoc.GetOneNotFound()
  @ApiParam({ name: 'id', description: 'Student ID identifier', example: 'SV2024001' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.studentIdsService.remove(id);
  }
}
