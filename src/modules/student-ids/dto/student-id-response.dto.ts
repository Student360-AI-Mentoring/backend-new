import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StudentIdResponseDto {
  @ApiProperty({
    description: 'National Student ID',
    example: 'NS001',
  })
  @Expose()
  id: string;

  @ApiProperty({
    name: 'full_name',
    description: 'Full name of the student',
    example: 'Nguyen Van An',
  })
  @Expose({ name: 'full_name' })
  fullName: string;

  @ApiProperty({
    name: 'date_of_birth',
    description: 'Date of birth',
    example: '2002-05-15',
  })
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'University name',
    example: 'Ho Chi Minh City University of Technology',
  })
  @Expose()
  university: string;

  @ApiProperty({
    description: 'Major/Field of study',
    example: 'Computer Science',
  })
  @Expose()
  major: string;

  @ApiProperty({
    name: 'enrollment_year',
    description: 'Enrollment year',
    example: 2021,
  })
  @Expose({ name: 'enrollment_year' })
  enrollmentYear: number;

  @ApiProperty({
    name: 'graduation_year',
    description: 'Graduation year',
    example: 2025,
  })
  @Expose({ name: 'graduation_year' })
  graduationYear: number;

  @ApiProperty({
    name: 'created_at',
    description: 'Creation timestamp',
    example: '2025-09-25T12:18:47.893Z',
  })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    description: 'Last update timestamp',
    example: '2025-09-25T12:18:47.893Z',
  })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
