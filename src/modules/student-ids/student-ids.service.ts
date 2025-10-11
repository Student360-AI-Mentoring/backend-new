import { Injectable } from '@nestjs/common';
import { StudentIdRepository } from './infrastructure/repositories/student-id.repository';
import { CreateStudentIdDto } from './dto/create-student-id.dto';
import { UpdateStudentIdDto } from './dto/update-student-id.dto';
import { StudentIdResponseDto } from './dto/student-id-response.dto';
import { StudentId } from './domain/student-id';
import { GetStudentIdsQueryDto } from './dto/get-student-ids-query.dto';
import { IPagination } from '@/type';
import { StudentIdExceptions } from './constants/student-id.constants';

@Injectable()
export class StudentIdsService {
  constructor(private readonly studentIdRepository: StudentIdRepository) {}

  async create(createStudentIdDto: CreateStudentIdDto): Promise<StudentIdResponseDto> {
    // Check if student ID already exists
    const existingStudentId = await this.studentIdRepository.findById(createStudentIdDto.id);

    if (existingStudentId) {
      throw StudentIdExceptions.StudentIdAlreadyExistsException();
    }

    const studentId = await this.studentIdRepository.create({
      id: createStudentIdDto.id,
      fullName: createStudentIdDto.fullName ?? null,
      dateOfBirth: createStudentIdDto.dateOfBirth ? new Date(createStudentIdDto.dateOfBirth) : null,
      university: createStudentIdDto.university ?? null,
      major: createStudentIdDto.major ?? null,
      enrollmentYear: createStudentIdDto.enrollmentYear ?? null,
      graduationYear: createStudentIdDto.graduationYear ?? null,
    });

    return this.toResponseDto(studentId);
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
      throw StudentIdExceptions.StudentIdNotFoundException();
    }

    return this.toResponseDto(studentId);
  }

  async update(id: string, updateStudentIdDto: UpdateStudentIdDto): Promise<StudentIdResponseDto> {
    const updateData: Partial<Omit<StudentId, 'id' | 'createdAt' | 'updatedAt'>> = {};

    if (updateStudentIdDto.fullName !== undefined) {
      updateData.fullName = updateStudentIdDto.fullName ?? null;
    }
    if (updateStudentIdDto.dateOfBirth !== undefined) {
      updateData.dateOfBirth = updateStudentIdDto.dateOfBirth ? new Date(updateStudentIdDto.dateOfBirth) : null;
    }
    if (updateStudentIdDto.university !== undefined) {
      updateData.university = updateStudentIdDto.university ?? null;
    }
    if (updateStudentIdDto.major !== undefined) {
      updateData.major = updateStudentIdDto.major ?? null;
    }
    if (updateStudentIdDto.enrollmentYear !== undefined) {
      updateData.enrollmentYear = updateStudentIdDto.enrollmentYear ?? null;
    }
    if (updateStudentIdDto.graduationYear !== undefined) {
      updateData.graduationYear = updateStudentIdDto.graduationYear ?? null;
    }

    const updatedStudentId = await this.studentIdRepository.update(id, updateData);

    if (!updatedStudentId) {
      throw StudentIdExceptions.StudentIdNotFoundException();
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
