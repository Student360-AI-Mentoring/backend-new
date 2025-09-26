import { Injectable } from '@nestjs/common';
import { StudentIdRepository } from './infrastructure/repositories/student-id.repository';
import { CreateStudentIdDto } from './dto/create-student-id.dto';
import { UpdateStudentIdDto } from './dto/update-student-id.dto';
import { StudentIdResponseDto } from './dto/student-id-response.dto';
import { StudentId } from './domain/student-id';
import { STUDENT_ID_ERRORS } from './constants/student-id.constants';
import { GetStudentIdsQueryDto } from './dto/get-student-ids-query.dto';
import { IPagination } from '@/type';

@Injectable()
export class StudentIdsService {
  constructor(private readonly studentIdRepository: StudentIdRepository) {}

  async create(createStudentIdDto: CreateStudentIdDto): Promise<StudentIdResponseDto> {
    // Check if student ID already exists
    const existingStudentId = await this.studentIdRepository.findById(createStudentIdDto.id);

    if (existingStudentId) {
      throw STUDENT_ID_ERRORS.STUDENT_ID_ALREADY_EXISTS;
    }

    await this.studentIdRepository.create({
      ...createStudentIdDto,
      dateOfBirth: createStudentIdDto.dateOfBirth ? new Date(createStudentIdDto.dateOfBirth) : undefined,
    });

    const savedStudentId = await this.studentIdRepository.findById(createStudentIdDto.id);
    return this.toResponseDto(savedStudentId);
  }

  async findAll(query: GetStudentIdsQueryDto): Promise<{ data: StudentIdResponseDto[]; pagination: IPagination }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const { data: studentIds, total } = await this.studentIdRepository.findAll({
      page,
      limit,
    });

    return {
      data: studentIds.map((studentId) => this.toResponseDto(studentId)),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<StudentIdResponseDto> {
    const studentId = await this.studentIdRepository.findById(id);

    if (!studentId) {
      throw STUDENT_ID_ERRORS.STUDENT_ID_NOT_FOUND;
    }

    return this.toResponseDto(studentId);
  }

  async update(id: string, updateStudentIdDto: UpdateStudentIdDto): Promise<StudentIdResponseDto> {
    const updatedStudentId = await this.studentIdRepository.update(id, {
      ...updateStudentIdDto,
      dateOfBirth: updateStudentIdDto.dateOfBirth ? new Date(updateStudentIdDto.dateOfBirth) : undefined,
    });

    if (!updatedStudentId) {
      throw STUDENT_ID_ERRORS.STUDENT_ID_NOT_FOUND;
    }

    return this.toResponseDto(updatedStudentId);
  }

  async remove(id: string): Promise<void> {
    await this.studentIdRepository.delete(id);
  }

  async search(query: string): Promise<StudentIdResponseDto[]> {
    const studentIds = await this.studentIdRepository.search(query);
    return studentIds.map((studentId) => this.toResponseDto(studentId));
  }

  private toResponseDto(studentId: StudentId): StudentIdResponseDto {
    const dto = new StudentIdResponseDto();
    dto.id = studentId.id;
    dto.fullName = studentId.fullName;
    dto.dateOfBirth = studentId.dateOfBirth;
    dto.university = studentId.university;
    dto.major = studentId.major;
    dto.enrollmentYear = studentId.enrollmentYear;
    dto.graduationYear = studentId.graduationYear;
    dto.createdAt = studentId.createdAt;
    dto.updatedAt = studentId.updatedAt;
    return dto;
  }
}
